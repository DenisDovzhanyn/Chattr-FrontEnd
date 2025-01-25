import { jwtDecode } from "jwt-decode"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { LoginForm, renewAccess } from "../services/userService"
import { LogIn } from "../services/userService"

interface UserState {
    userId: number | null
    access: string | null
    access_exp: number | null
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
    access_exp: null,
    isLoading: false,
    error: '',
    keepLoggedin: false
}

export const logInAsync = createAsyncThunk(
    "user/logInAsync",
    async (form: LoginForm) => await LogIn(form)
)

export const loadSessionAsync = createAsyncThunk(
    "user/loadSessionAsync",
    async () => {
        const TOKEN_KEY = 'access'
        let token = localStorage.getItem(TOKEN_KEY)
        if (!token) token = sessionStorage.getItem(TOKEN_KEY)

        let decodedToken = token ? jwtDecode<JwtClaim>(token) : null

        if (decodedToken && decodedToken.exp > Date.now() / 1000) return token
            
        localStorage.removeItem('access')
        sessionStorage.removeItem('access')

        return (await renewAccess()).access_token     
    }
)



export const renewAccessAsync = createAsyncThunk(
    "user/renewAccessAsync",
    async () => {
        return (await renewAccess()).access_token
    }
)

export const userSlice = createSlice( {
    name: 'user',
    initialState,
    reducers: {
        setKeepLoggedIn: (state) => {
            state.keepLoggedin = !state.keepLoggedin
        },
        clearUserData: (state) => {
            state.access = null
            state.userId = null
            localStorage.clear()
            sessionStorage.clear()
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    },
    extraReducers: (builder) => {
            builder
                .addCase(logInAsync.pending, (state) => {
                    state.isLoading = true;
                    state.error = ''
                })
                .addCase(logInAsync.fulfilled, (state, action) => {
                    state.access = action.payload.access_token
                    const decodedToken = jwtDecode<JwtClaim>(action.payload.access_token)
                    state.userId = decodedToken.user_id
                    state.access_exp = decodedToken.exp

                    localStorage.removeItem('access')
                    sessionStorage.removeItem('access')
                    if (state.keepLoggedin) localStorage.setItem('access', action.payload.access_token)
                    else sessionStorage.setItem('access', action.payload.access_token)

                    localStorage.setItem('keepLoggedIn', `${state.keepLoggedin}`)

                    state.isLoading = false;
                })
                .addCase(logInAsync.rejected, (state, action) => {
                    state.error = action.error.message || ''
                    state.isLoading = false
                })
                .addCase(loadSessionAsync.pending, (state) => {
                    state.isLoading = true
                })
                .addCase(loadSessionAsync.fulfilled, (state, action) => {
                    let token = action.payload
                    const decodedToken = jwtDecode<JwtClaim>(token)
                    state.userId = decodedToken.user_id
                    state.access = token
                    state.access_exp = decodedToken.exp
                    state.isLoading = false
                    localStorage.removeItem('access')
                    sessionStorage.removeItem('access')
                    const keepLogged = Boolean(localStorage.getItem('keepLoggedIn'))

                    if (keepLogged) sessionStorage.setItem('access', token)
                    else localStorage.setItem('access', token)
                })
                .addCase(loadSessionAsync.rejected, (state) => {
                    state.userId = null
                    state.access = null
                    state.access_exp = null
                    state.isLoading = false
                    localStorage.removeItem('access')
                    sessionStorage.removeItem('access')
                })
                .addCase(renewAccessAsync.pending, (state) => {
                    state.isLoading = true;
                })
                .addCase(renewAccessAsync.fulfilled, (state, action) => {
                    let token = action.payload
                    state.access = token
                    state.access_exp = jwtDecode<JwtClaim>(action.payload).exp
                    state.isLoading = false
                    localStorage.removeItem('access')
                    sessionStorage.removeItem('access')

                    const keepLogged = Boolean(localStorage.getItem('keepLoggedIn'))
                    if (keepLogged) sessionStorage.setItem('access', token)
                    else localStorage.setItem('access', token)
                })
                .addCase(renewAccessAsync.rejected, (state) => {
                    state.userId = null
                    state.access = null
                    state.access_exp = null
                    state.isLoading = false
                    localStorage.removeItem('access')
                    sessionStorage.removeItem('access')
                })
        },
        
})

export default userSlice.reducer
export const {setKeepLoggedIn, clearUserData, setError} = userSlice.actions