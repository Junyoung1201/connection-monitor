import { createSlice } from "@reduxjs/toolkit";
import { I_ConnectionInfo } from "types/connection";

const initialState: {
    connectionList: I_ConnectionInfo[]
    hideFrom?: boolean
    search?: string
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
        }
    }
})

export const {setConnectionList,setHideFrom,setSearch} = connectionSlice.actions;
export default connectionSlice.reducer;