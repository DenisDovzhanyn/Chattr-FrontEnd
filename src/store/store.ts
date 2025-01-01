import { configureStore } from "@reduxjs/toolkit";
import isLoadingReducer from "./isLoadingSlice";

export const store =  configureStore({
    reducer: {
        isLoading: isLoadingReducer
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch