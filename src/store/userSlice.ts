import { jwtDecode } from "jwt-decode"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { LoginForm } from "../services/userService"
import { LogIn } from "../services/userService"

interface UserState {
    userId: number | null
    jwt: string | null
    isLoading: boolean
}
interface JwtClaim {
    user_id: number | null
}
// landing page stuff these two lines
const token = localStorage.getItem('jwt')
const decodedToken = token ? jwtDecode<JwtClaim>(token) : null

const initialState: UserState = {
    userId: decodedToken?.user_id || null,
    jwt: token || null,
    isLoading: false
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
                    }
                ).addCase(logInAsync.fulfilled,
                    (state, action) => {
                        state.jwt = action.payload
                        state.userId = jwtDecode<JwtClaim>(action.payload).user_id
                        localStorage.setItem('jwt', action.payload)
                        state.isLoading = false;
                    }
                ).addCase(logInAsync.rejected,
                    (state, action) => {
                        console.log(action.error)
                        state.isLoading = false;
                    }
                )
        }
})

export default userSlice.reducer