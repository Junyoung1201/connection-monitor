export interface I_ConnectionInfo {
    proto: 'TCP' | 'UDP'
    state: string
    from: string
    to: string
    pid: string
}

export enum ConnectionStateType {
    ESTABLISHED = 'established',
    CLOSE_WAIT = 'close_wait',
    TIME_WAIT = 'time_wait',
    SYN_SENT = 'syn_sent',
    LISTEN = 'listen',
    FIN_WAIT1 = 'fin_wait1',
    FIN_WAIT2 = 'fin_wait2',
    CLOSING = 'closing',
    LAST_ACK = 'last_ack',
    CLOSED = 'closed',
}