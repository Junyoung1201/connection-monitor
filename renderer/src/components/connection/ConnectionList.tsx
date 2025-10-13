import { useSelector } from "react-redux";
import { RootState, store } from "store/store";
import ConnectionItem from "./ConnectionItem";
import './ConnectionList.css';
import { setSorting } from "store/connection";

export default function ConnectionList() {
    const { connectionList, hideFrom, sortField, sortDirection } = useSelector((state: RootState) => state.connection);
    const ignoreAddressList = [
        "0.0.0.0", "[::]", "[::1]"
    ]

    function isIgnoredAddress(address?: string) {
        if (!address) {
            return true;
        }

        let _address = address.slice(0, address.lastIndexOf(":"));

        if ((_address?.length ?? 0) > 0) {
            return ignoreAddressList.includes(_address.trim());
        } else {
            return true;
        }
    }

    function handleSort(field: 'proto' | 'from' | 'to' | 'state' | 'pid') {
        store.dispatch(setSorting({ field }));
    }

    function sortConnections(connections: typeof connectionList) {
        if (!sortField || !sortDirection) return connections;

        return [...connections].sort((a, b) => {
            let aValue = '';
            let bValue = '';

            switch (sortField) {
                case 'proto':
                    aValue = a.proto;
                    bValue = b.proto;
                    break;
                case 'from':
                    aValue = a.from || '';
                    bValue = b.from || '';
                    break;
                case 'to':
                    aValue = a.to || '';
                    bValue = b.to || '';
                    break;
                case 'state':
                    aValue = a.state || '';
                    bValue = b.state || '';
                    break;
                case 'pid':
                    aValue = a.pid || '';
                    bValue = b.pid || '';
                    break;
            }

            const comparison = aValue.localeCompare(bValue);
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }

    const getSortIcon = (field: string) => {
        if (sortField !== field) return '';
        return sortDirection === 'asc' ? ' ▲' : ' ▼';
    }

    return (
        <div className="con-list">
            <div className="con-item">
                <div onClick={() => handleSort('proto')}>
                    {getSortIcon('proto')}
                </div>
                {!hideFrom && <div onClick={() => handleSort('from')}>
                    출발주소{getSortIcon('from')}
                </div>}
                <div onClick={() => handleSort('to')}>
                    외부주소{getSortIcon('to')}
                </div>
                <div onClick={() => handleSort('state')}>
                    상태{getSortIcon('state')}
                </div>
                <div onClick={() => handleSort('pid')}>
                    프로세스{getSortIcon('pid')}
                </div>
            </div>
            <div className="con-list-content">
                {
                    sortConnections(
                        connectionList.filter(con => (
                            !isIgnoredAddress(con.to)
                        ))
                    ).map((con, i) => <ConnectionItem
                        key={`connection-item_${i}`}
                        proto={con.proto}
                        state={con.state}
                        from={con.from}
                        to={con.to}
                        pid={con.pid}
                    />)
                }
            </div>
        </div>
    )
}