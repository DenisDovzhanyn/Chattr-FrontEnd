import { configureStore } from "@reduxjs/toolkit";

import userReducer from './userSlice';
import chatReducer from './chatSlice';
import appReducer from './appSlice'
export const store =  configureStore({
    reducer: {
        user: userReducer,
        chats: chatReducer,
        app: appReducer
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const appDispatch = store.dispatch