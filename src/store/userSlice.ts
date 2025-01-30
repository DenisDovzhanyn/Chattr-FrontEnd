import { jwtDecode } from "jwt-decode"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { LoginForm, renewAccess } from "../services/userService"
import { LogIn } from "../services/userService"

const ACCESS_KEY = 'access'
const KEEP_LOGGED_IN_KEY = 'keepLoggedIn'

interface UserState {
    userId: number | null
    access: string | null
    access_exp: number | null
    isLoading: boolean
    error: string 
    keepLoggedIn: boolean
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
    isLoading: true,
    error: '',
    keepLoggedIn: false
}

export const logInAsync = createAsyncThunk(
    "user/logInAsync",
    async (form: LoginForm) => await LogIn(form)
)

export const loadSessionAsync = createAsyncThunk(
    "user/loadSessionAsync",
    async () => {
        
        let token = getTokenFromStorage()

        let decodedToken = token ? jwtDecode<JwtClaim>(token) : null

        if (decodedToken && decodedToken.exp > Date.now() / 1000) return token
            
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
            state.keepLoggedIn = !state.keepLoggedIn
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

                    storeToken(state.access!, state.keepLoggedIn)

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

                    storeToken(state.access!)
                })
                .addCase(loadSessionAsync.rejected, (state) => {
                    state.userId = null
                    state.access = null
                    state.access_exp = null
                    state.isLoading = false
                    localStorage.removeItem(ACCESS_KEY)
                    sessionStorage.removeItem(ACCESS_KEY)
                })
                .addCase(renewAccessAsync.pending, (state) => {
                    state.isLoading = true;
                })
                .addCase(renewAccessAsync.fulfilled, (state, action) => {
                    let token = action.payload
                    state.access = token
                    state.access_exp = jwtDecode<JwtClaim>(action.payload).exp
                    state.isLoading = false

                    storeToken(state.access!)
                })
                .addCase(renewAccessAsync.rejected, (state) => {
                    state.userId = null
                    state.access = null
                    state.access_exp = null
                    state.isLoading = false
                    localStorage.removeItem(ACCESS_KEY)
                    sessionStorage.removeItem(ACCESS_KEY)
                })
        },
        
})


const storeToken = (access_token: string, force_remember: boolean | null = null) => {
    let storage = localStorage

    if (force_remember === null) {
        storage = localStorage.getItem(KEEP_LOGGED_IN_KEY) === 'true' ? localStorage : sessionStorage
    } else if (force_remember === false){
        storage = sessionStorage
    } 

    if (force_remember !== null) {
        localStorage.setItem(KEEP_LOGGED_IN_KEY, `${force_remember}`)
    }
    storage.setItem(ACCESS_KEY, access_token)
}

export const getTokenFromStorage = () => {
    const storage = localStorage.getItem(KEEP_LOGGED_IN_KEY) === 'true' ? localStorage : sessionStorage
    return storage.getItem(ACCESS_KEY)
}

export default userSlice.reducer
export const {setKeepLoggedIn, clearUserData, setError} = userSlice.actions