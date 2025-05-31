import React, { memo, useEffect, useRef, useState } from "react"
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
    const [copied,setCopied] = useState<string | undefined>();

    const conItemRef = useRef<HTMLDivElement>(null);

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

    function copyText(str: string) {
        window.app.invoke("copy", str);
    }

    function isChildDiv(target: HTMLElement) {
        return (
            conItemRef.current && conItemRef.current.contains(target)
        )
    }
    
    function onClickChildDiv(e: React.MouseEvent<HTMLDivElement>) {
        const target = e.target as HTMLElement;

        if(isChildDiv(target)) {

            let str = target.textContent?.trim()
            
            if(str) {
                copyText(str);

                target.setAttribute("data-copied", "");
            }
        }
    }

    function onMouseLeaveChildDiv(e: React.MouseEvent<HTMLDivElement>) {
        const target = e.target as HTMLElement;

        if(isChildDiv(target) && target.hasAttribute("data-copied")) {
            target.removeAttribute("data-copied");
            let copiedDiv = target.querySelector("div.copied");

            if(copiedDiv) {
                target.removeChild(copiedDiv);
            }
        }  
    }

    return (
        <div className="con-item" style={{background: stateColors[state]}} onClick={onClickChildDiv} ref={conItemRef} onMouseLeave={onMouseLeaveChildDiv}>
            <div data-name="proto">{proto}</div>
            {!hideFrom && <div data-name="from-address">{from}</div>}
            <div data-name="to-address">{to}</div>
            <div data-name="state">{state}</div>
            <div className="p-name" data-empty={process === undefined} data-name="p-name">
                {
                    process === undefined ? `알 수 없음(${pid})` : `${process.name}(${process.pid})`
                }
            </div>
        </div>
    )
}

export default memo(ConnectionItem);