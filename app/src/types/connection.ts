export interface I_ConnectionInfo {
    proto: 'TCP' | 'UDP'
    state: string
    from: string
    to: string
    pid: string
}