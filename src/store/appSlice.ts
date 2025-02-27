import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { act } from "react"

interface AppState {
    currTime: number
}

const initialState: AppState = {
    currTime: Date.now()
}

export const appSlice = createSlice( {
    name: 'app',
    initialState,
    reducers: {
        updateCurrTime: (state, action) => {
            state.currTime = action.payload
        }
    }
})


export default appSlice.reducer
export const {updateCurrTime} = appSlice.actions