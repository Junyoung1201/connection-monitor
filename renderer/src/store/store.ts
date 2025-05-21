import {configureStore} from '@reduxjs/toolkit';
import connection from './connection';

export const store = configureStore({
    reducer: {
        connection
    }
})

export type RootState = ReturnType<typeof store.getState>