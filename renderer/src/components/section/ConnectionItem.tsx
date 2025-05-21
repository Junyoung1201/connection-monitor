import { memo, useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { ConnectionStateType, I_ConnectionInfo } from "types/connection";
import { I_ProcessInfo } from "types/process";

const stateColors: { [state: string]: string } = {
    "ESTABLISHED": '#4CAF50',
    "CLOSE_WAIT": '#FFB74D',
    "TIME_WAIT": '#FFF176',
    "SYN_SENT": '#81D4FA',
    "LISTEN": '#AED581',
    "FIN_WAIT1": '#A1887F',
    "FIN_WAIT2": '#A1887F',
    "CLOSING": '#F57C00',
    "LAST_ACK": '#BA68C8',
    "CLOSED": '#BDBDBD',
};

function ConnectionItem(con: I_ConnectionInfo) {

    const { proto, state, from, to, pid } = con;
    const { hideFrom,search } = useSelector((state: RootState) => state.connection);
    const [process,setProcess] = useState<I_ProcessInfo | undefined>();

    useEffect(() => {
        window.app.invoke("getProcessInfoByPID", pid).then(setProcess)
    },[])

    const isSearched = () => (
        ![...Object.values(con),process?.name].some((v: string) => 
            v?.toLowerCase()?.trim()?.includes(search!.toLowerCase())
        )
    )

    if(search && isSearched()) {
        return null;
    }

    return (
        <div className="con-item" style={{background: stateColors[state]}}>
            <div>{proto}</div>
            {!hideFrom && <div>{from}</div>}
            <div>{to}</div>
            <div>{state}</div>
            <div className="p-name" data-empty={process === undefined}>
                {
                    process === undefined ? `알 수 없음(${pid})` : `${process.name}(${process.pid})`
                }
            </div>
        </div>
    )
}

export default memo(ConnectionItem);