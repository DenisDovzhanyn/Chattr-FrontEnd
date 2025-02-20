import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getChats, createChat, getChatMessages } from "../services/ChatService"


interface ChatState {
    chats: Chat[]
    isLoading: boolean
    error: string
    currentlySelected?: Chat
}

export interface Chat {
    id: number,
    last_msg_time: number
    chat_name: string
    users?: User[]
    messages?: Message[]

}

interface Message {
    id: number,
    content: string,
    chat_id: number,
    user_id: number,
    inserted_at: number
}

export interface User {
    display_name: string,
    id: number
}


const initialState: ChatState = {
    chats: [],
    isLoading: false,
    error: '',
}

export const loadChatsAsync = createAsyncThunk(
    "chats/loadChatsAsync",
    async () => await getChats()
)

export const selectChatAsync = createAsyncThunk(
    "chats/selectChatAsync",
    async (chat_id: number) => await getChatMessages(chat_id) 
)

export const createNewChatAsync = createAsyncThunk(
    "chats/createNewChatAsync",
    async (chat_name: string) => await createChat(chat_name)
)

export const chatSlice = createSlice( {
    name: 'chats',
    initialState,
    reducers: {
        addMessageToChat: (state, action) => {
            if (action.payload.chat_id === state.currentlySelected?.id) {
                state.currentlySelected = {
                    ...state.currentlySelected,
                    messages: [...(state.currentlySelected?.messages || []), action.payload.message]
                } as Chat
            }
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
            .addCase(createNewChatAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createNewChatAsync.fulfilled, (state, action) => {
                state.chats = [action.payload.chats, ...state.chats]
                state.isLoading = false
                state.error = ''
            })
            .addCase(createNewChatAsync.rejected, (state, action) => {
                state.error = action.error.message || ''
                state.isLoading = false
            })
            .addCase(selectChatAsync.pending, (state) => {
                state.isLoading = true
            })
            .addCase(selectChatAsync.fulfilled, (state, action) => {
                const messages: Message[] = action.payload.messages

                const chat = {...(state.chats.find(chat => chat.id == action.payload.chat_id) as Chat)}
                chat.messages = messages
                
                state.currentlySelected = chat
                state.isLoading = false
                state.error = ''
            })
            .addCase(selectChatAsync.rejected, (state, action) => {
                state.error = action.error.message || ''
                state.isLoading = false
            })
    }
})

export const {addMessageToChat} = chatSlice.actions
export default chatSlice.reducer
