import { exec } from "child_process";
import { I_ConnectionInfo } from "../types/connection";
import { I_ProcessInfo } from "../types/process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface CachedConnection {
    connection: I_ConnectionInfo;
    lastSeen: number;
}

export default class ConnectionMonitor {
    private static cache = new Map<string, CachedConnection>();
    private static processCache = new Map<string, I_ProcessInfo>();
    private static lastUpdate = 0;
    private static readonly CACHE_TTL = 3000; // 3초
    private static readonly UPDATE_THRESHOLD = 200; // 최소 200ms 간격

    static log(message: string, level: 'log' | 'error' | 'warn' = 'log') {
        console[level]("[ConnectionMonitor]", message);
    }

    private static generateConnectionKey(conn: I_ConnectionInfo): string {
        return `${conn.proto}_${conn.from}_${conn.to}_${conn.state}_${conn.pid}`;
    }

    static async getConnectionList(): Promise<I_ConnectionInfo[]> {
        const now = Date.now();
        
        // 캐시된 데이터가 있고 & 최소 간격이 지나지 않았으면 캐시 반환
        if (now - this.lastUpdate < this.UPDATE_THRESHOLD && this.cache.size > 0) {
            return Array.from(this.cache.values())
                .filter(cached => now - cached.lastSeen < this.CACHE_TTL)
                .map(cached => cached.connection);
        }

        this.lastUpdate = now;

        try {
            const connections = await this.getNetstatConnections();
            
            // 캐시 업데이트
            const newCache = new Map<string, CachedConnection>();
            
            connections.forEach(conn => {
                const key = this.generateConnectionKey(conn);
                newCache.set(key, {
                    connection: conn,
                    lastSeen: now
                });
            });

            this.cache = newCache;
            
            this.log(`Updated connection list: ${connections.length} active connections`);
            return connections;
            
        } catch (error) {
            this.log(`Error getting connection list: ${error}`, 'error');
            
            // 에러 시 캐시에서 최근 데이터 반환
            return Array.from(this.cache.values())
                .filter(cached => now - cached.lastSeen < this.CACHE_TTL * 2)
                .map(cached => cached.connection);
        }
    }

    private static async getNetstatConnections(): Promise<I_ConnectionInfo[]> {
        return new Promise((resolve, reject) => {
            
            const proc = exec("netstat -ano");
            const connections: I_ConnectionInfo[] = [];

            proc.stdout?.on('data', (data: string) => {
                try {
                    for (const line of data.split("\n")) {
                        const arr = line.split(/\s+/).filter(str => str.length > 0);
                        
                        if (arr.length === 5) {
                            const [proto, from, to, state, pid] = arr;
                            
                            // TCP만 처리하고 유효한 연결만 추가
                            if (proto === 'TCP' && from && to && state && pid) {
                                connections.push({ 
                                    proto: proto as 'TCP', 
                                    from, 
                                    to, 
                                    state, 
                                    pid 
                                });
                            }
                        }
                    }
                } catch (parseError) {
                    this.log(`Parse error: ${parseError}`, 'warn');
                }
            });

            proc.stderr?.on('data', (err) => {
                this.log(`Netstat stderr: ${err}`, 'warn');
            });

            proc.on('close', (code) => {
                if (code === 0) {
                    resolve(connections);
                } else {
                    reject(new Error(`netstat exited with code ${code}`));
                }
            });

            proc.on('error', (error) => {
                reject(error);
            });

            // 5초 타임아웃 설정
            setTimeout(() => {
                proc.kill();
                reject(new Error('netstat timeout'));
            }, 5000);
        });
    }

    static async getProcessInfoByPID(pid: string): Promise<I_ProcessInfo | undefined> {
        pid = pid.trim();

        const isNumber = (str: string) => {
            try {
                parseInt(str);
                return !isNaN(parseInt(str));
            } catch {
                return false;
            }
        }

        if (!isNumber(pid)) {
            throw new Error('invalid pid');
        }

        // 캐시 확인
        if (this.processCache.has(pid)) {
            return this.processCache.get(pid);
        }

        try {
            const processInfo = await this._getProcessInfoByPid(pid);

            // 캐시에 저장 (3초간 유지)
            if (processInfo) {
                this.processCache.set(pid, processInfo);
                setTimeout(() => {
                    this.processCache.delete(pid);
                }, 3000);
            }

            return processInfo;

        } catch (error) {
            this.log(`Error getting process info for PID ${pid}: ${error}`, 'warn');
            return undefined;
        }
    }

    private static async _getProcessInfoByPid(pid: string): Promise<I_ProcessInfo | undefined> {
        const {stdout,stderr} = await execAsync(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`);
        
        if (stderr) {
            throw new Error(stderr);
        }

        if(stdout.trim().includes('","')) {
            const line = stdout.trim();
            let [name, , sName, , memory] = line.split('","').map(s => s.trim());

            name = name.slice(1);
            memory = memory.slice(0, -1);

            return { name, sName, memory, pid };
        }

        return undefined;
    }
}