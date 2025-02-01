import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getChats } from "../services/ChatService"


interface ChatState {
    chats: Chat[]
    isLoading: boolean
    error: string
}

export interface Chat {
    id: number,
    last_msg_time: number
    chat_name: string
    users: User[]
}

export interface User {
    display_name: string,
    id: number
}


const initialState: ChatState = {
    chats: [],
    isLoading: false,
    error: ''
}

export const loadChatsAsync = createAsyncThunk(
    "chats/loadChatsAsync",
    async () => await getChats()
)


export const chatSlice = createSlice( {
    name: 'chats',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(loadChatsAsync.pending, (state) => {
                state.isLoading = true
                state.error = ''
            })
            .addCase(loadChatsAsync.fulfilled, (state, action) => {
                state.chats = action.payload.chats
                state.isLoading = false
                state.error = ''
            })
            .addCase(loadChatsAsync.rejected, (state, action) =>{
                state.error = action.error.message || ''
                state.isLoading = false
            })
    }
})


export default chatSlice.reducer