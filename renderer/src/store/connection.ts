import { createSlice } from "@reduxjs/toolkit";
import { I_ConnectionInfo } from "types/connection";

type SortField = 'proto' | 'from' | 'to' | 'state' | 'pid';
type SortDirection = 'asc' | 'desc';

const initialState: {
    connectionList: I_ConnectionInfo[]
    hideFrom?: boolean
    search?: string
    sortField?: SortField
    sortDirection?: SortDirection
} = {
    connectionList: [],
}

export const connectionSlice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        setSearch(state, action) {
            state.search = action.payload
        },

        setHideFrom(state, action) {
            state.hideFrom = action.payload;
        },

        setConnectionList(state, action) {
            state.connectionList = action.payload;
        },

        setSorting(state, action: { payload: { field: SortField } }) {
            const { field } = action.payload;
            
            // 같은 필드를 클릭하면 방향 전환, 다른 필드면 오름차순으로 시작
            if (state.sortField === field) {
                state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                state.sortField = field;
                state.sortDirection = 'asc';
            }
        }
    }
})

export const {setConnectionList,setHideFrom,setSearch,setSorting} = connectionSlice.actions;
export default connectionSlice.reducer;