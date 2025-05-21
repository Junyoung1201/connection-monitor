import { exec } from "child_process";
import { I_ConnectionInfo } from "../types/connection";
import { I_ProcessInfo } from "../types/process";

export default class ConnectionMonitor {
    static log(message: string, level: 'log' | 'error' | 'warn' = 'log') {
        console[level]("[ConnectionMonitor]", message);
    }

    static getConnectionList() {
        let proc = exec("chcp 65001 && netstat -ano")

        let conList: I_ConnectionInfo[] = []

        proc?.stdout?.on('data', data => {

            for (let line of data.split("\n")) {
                let arr = line.split(" ")
                    .filter((str: string) => str && str.length > 0)
                    .map((str: string) => str.trim())

                if (arr.length === 5) {
                    let [proto, from, to, state, pid] = arr;
                    conList.push({ proto, from, to, state, pid });
                }
            }
        })

        return new Promise((resolve, reject) => {

            proc?.stderr?.on('data', err => {
                ConnectionMonitor.log("getConnectionList error", 'error');
                reject(err);
                return undefined;
            })

            proc?.stdout?.on('close', () => {
                ConnectionMonitor.log(`getConnectionList return ${conList.length} of connection`);
                resolve(conList);
            })
        })
    }

    static getProcessInfoByPID(pid: string) {
        pid = pid.trim();

        const isNumber = (str: string) => {
            try {
                parseInt(str) + 1;
                return true;
            } catch {
                return false;
            }
        }

        if (!isNumber(pid)) {
            throw `invalid pid`
        }

        const parseProcessInfo = (line: string) => {

            let pInfo: I_ProcessInfo | undefined = undefined;

            let arr = line.split(" ").filter(str => str.length > 0).map(str => str.trim());
            let [name, _pid, sName, _, memory] = arr;

            if (!isNumber(_pid)) {
                return undefined;
            }

            if (pid === "7992") {
                console.log("_pid", _pid, "pid", pid, arr);
            }

            if (name && _pid && sName && memory) {
                pInfo = {
                    name, pid: _pid, sName, memory
                }
                ConnectionMonitor.log(`getProcessInfoByPID(${_pid}) -> name: ${name}, sName: ${sName}`);
            }

            return pInfo;
        }

        let procInfo: I_ProcessInfo | undefined = undefined;
        let proc = exec(`chcp 65001 && tasklist | findstr ${pid}`)

        proc?.stdout?.on('data', (data: string) => {
            if(data.includes("\n")) {
                for(let line of data.split("\n")) {
                    let tmpProc = parseProcessInfo(line);

                    if(tmpProc && tmpProc.pid === pid) {
                        procInfo = tmpProc;
                        break;
                    }
                }
            }
        })

        return new Promise((resolve, reject) => {
            proc?.stderr?.on('data', err => {
                ConnectionMonitor.log(err, 'error');
                reject(err);
            })

            proc?.stdout?.on('close', () => {
                resolve(procInfo);
            })
        })
    }
}