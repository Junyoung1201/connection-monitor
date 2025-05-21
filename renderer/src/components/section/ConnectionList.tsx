import { useSelector } from "react-redux";
import { RootState } from "store/store";
import ConnectionItem from "./ConnectionItem";
import './ConnectionList.css';

export default function ConnectionList() {
    const {connectionList,hideFrom} = useSelector((state: RootState) => state.connection);
    const ignoreAddressList = [
        "0.0.0.0", "[::]", "[::1]"
    ]

    function isIgnoredAddress(address?: string) {
        if(!address) {
            return true;
        }

        let _address = address.slice(0,address.lastIndexOf(":"));

        if((_address?.length ?? 0) > 0) {
            return ignoreAddressList.includes(_address.trim());
        } else {
            return true;
        }
    }

    return (
        <div className="con-list">
            <div className="con-item">
                <div></div>
                { !hideFrom && <div>출발주소</div> }
                <div>외부주소</div>
                <div>상태</div>
                <div>프로세스</div>
            </div>
            {
                connectionList
                .filter(con => (
                    !isIgnoredAddress(con.to)
                ))
                .map((con,i) => <ConnectionItem 
                    key={con.pid+"_"+i} 
                    proto={con.proto}
                    state={con.state}
                    from={con.from}
                    to={con.to}
                    pid={con.pid}
                />)
            }
        </div>
    )
}