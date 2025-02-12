import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getChats, createChat } from "../services/ChatService"


interface ChatState {
    chats: Chat[]
    isLoading: boolean
    error: string
    currentlySelected: number | null
}

export interface Chat {
    id: number,
    last_msg_time: number
    chat_name: string
    users?: User[]
}

export interface User {
    display_name: string,
    id: number
}


const initialState: ChatState = {
    chats: [],
    isLoading: false,
    error: '',
    currentlySelected: null
}

export const loadChatsAsync = createAsyncThunk(
    "chats/loadChatsAsync",
    async () => await getChats()
)

export const createNewChatAsync = createAsyncThunk(
    "chats/createNewChatAsync",
    async (chat_name: string) => await createChat(chat_name)
)

export const chatSlice = createSlice( {
    name: 'chats',
    initialState,
    reducers: {
        setCurrentlySelected: (state, action) => {
            state.currentlySelected = action.payload
        }

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
            .addCase(createNewChatAsync.fulfilled, (state, action) => {
                state.chats = [action.payload.chats, ...state.chats]
            })
            .addCase(createNewChatAsync.rejected, (state, action) => {
                state.error = action.error.message || ''
            })
    }
})


export default chatSlice.reducer
export const {setCurrentlySelected} = chatSlice.actions