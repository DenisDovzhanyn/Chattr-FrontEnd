import { jwtDecode } from "jwt-decode"
import { createSlice } from "@reduxjs/toolkit"

interface UserState {
    userId: number | null
    jwt: string | null
}
interface JwtClaim {
    user_id: number | null
}

const token = localStorage.getItem('jwt')
const decodedToken = token ? jwtDecode<JwtClaim>(token) : null

const initialState: UserState = {
    userId: decodedToken?.user_id || null,
    jwt: token || null
}

export const userSlice = createSlice( {
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.jwt = action.payload
            state.userId = jwtDecode<JwtClaim>(action.payload).user_id
            localStorage.setItem('jwt', action.payload)
        }
    }
})

export const { setUser } = userSlice.actions
export default userSlice.reducer