import { jwtDecode } from "jwt-decode"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { LoginForm } from "../services/userService"
import { LogIn } from "../services/userService"

interface UserState {
    userId: number | null
    access: string | null
    isLoading: boolean
    error: string 
}
interface JwtClaim {
    user_id: number | null
    exp: number
    token_type: string
}

let token = localStorage.getItem('access')
const decodedToken = token ? jwtDecode<JwtClaim>(token) : null

if (decodedToken && decodedToken.exp < Date.now() / 1000) {
    localStorage.removeItem('access')
    token = null
}
const initialState: UserState = {
    userId: decodedToken?.user_id || null,
    access: token,
    isLoading: false,
    error: ''
}

export const logInAsync = createAsyncThunk(
    "user/logInAsync",
    async (form: LoginForm) => await LogIn(form)
)

export const userSlice = createSlice( {
    name: 'user',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
            builder
                .addCase(logInAsync.pending, 
                    (state) => {
                        state.isLoading = true;
                        state.error = ''
                    }
                ).addCase(logInAsync.fulfilled,
                    (state, action) => {
                        state.access = action.payload.access_token
                        state.userId = jwtDecode<JwtClaim>(action.payload.access_token).user_id
                        localStorage.setItem('access', action.payload.access_token)
                        state.isLoading = false;
                    }
                ).addCase(logInAsync.rejected,
                    (state, action) => {
                        state.error = action.error.message || ''
                        state.isLoading = false
                    }
                )
        }
})

export default userSlice.reducer