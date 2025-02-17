import { configureStore } from "@reduxjs/toolkit";

import userReducer from './userSlice';
import chatReducer from './chatSlice';

export const store =  configureStore({
    reducer: {
        user: userReducer,
        chats: chatReducer
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const appDispatch = store.dispatch