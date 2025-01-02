import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {LogIn, LoginForm} from "../services/userService";
import { setUser } from "./userSlice";

interface IsLoadingState {
    value: boolean
}

const initialState: IsLoadingState = {
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
            (state) => {
                state.value = false;
            }
        ).addCase(logInAsync.rejected,
            (state, action) => {
                console.log(action.error)
                state.value = false;

            }
        )
    }
})

export const logInAsync = createAsyncThunk(
    "isLoading/logInAsync",
    async (form: LoginForm, {dispatch}) => {
        const jwt = await LogIn(form)
        dispatch(setUser(jwt.Jwt));
        return jwt
    }
)
export default isLoadingSlice.reducer