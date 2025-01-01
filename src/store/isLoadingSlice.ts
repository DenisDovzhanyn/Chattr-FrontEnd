import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {LogIn, LoginForm} from "../services/userService";

interface isLoadingState {
    value: boolean
}

const initialState: isLoadingState = {
    value: false
}
export const isLoadingSlice = createSlice({
    name: 'isLoading',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(logInAsync.pending, 
            (state) => {
                state.value = true;
            }
        ).addCase(logInAsync.fulfilled,
            (state, action /* jwt */) => {
                state.value = false;
                // call a diff function to store the jwt?
            }
        ).addCase(logInAsync.rejected,
            (state) => {
                state.value = false;

            }
        )
    }
})

export const logInAsync = createAsyncThunk(
    "isLoading/logInAsync",
    async ({username, password}: LoginForm) => {
        const jwt = await LogIn({username, password})
        return jwt
    }
)
export default isLoadingSlice.reducer