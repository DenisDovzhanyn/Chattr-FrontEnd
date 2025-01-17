import { jwtDecode } from "jwt-decode"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { LoginForm } from "../services/userService"
import { LogIn } from "../services/userService"

interface UserState {
    userId: number | null
    access: string | null
    isLoading: boolean
    error: string 
    keepLoggedin: boolean
}
interface JwtClaim {
    user_id: number | null
    exp: number
    token_type: string
}


const initialState: UserState = {
    userId: null,
    access: null,
    isLoading: false,
    error: '',
    keepLoggedin: false
}

export const logInAsync = createAsyncThunk(
    "user/logInAsync",
    async (form: LoginForm) => await LogIn(form)
)

export const userSlice = createSlice( {
    name: 'user',
    initialState,
    reducers: {
        loadSession: (state) => {
            const TOKEN_KEY = 'access'
            let token = localStorage.getItem(TOKEN_KEY)
            if (!token) token = sessionStorage.getItem(TOKEN_KEY)

            const decodedToken = token ? jwtDecode<JwtClaim>(token) : null

            if (decodedToken && decodedToken.exp < Date.now() / 1000) {
                localStorage.removeItem('access')
                sessionStorage.removeItem('access')
                token = null
            }

            state.access = token
            state.userId = decodedToken?.user_id || null

        },
        setKeepLoggedIn: (state) => {
            state.keepLoggedin = !state.keepLoggedin
        } 
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

                        if (state.keepLoggedin) localStorage.setItem('access', action.payload.access_token)
                        else sessionStorage.setItem('access', action.payload.access_token)

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
export const {loadSession, setKeepLoggedIn} = userSlice.actions