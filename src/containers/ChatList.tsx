import { useEffect, useState } from 'react'
import './ChatList.css'
import { loadChatsAsync } from '../store/chatSlice'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'


function ChatList() {
    const {chats} = useSelector((state: RootState) => state.chats)
    const {access} = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {

        dispatch(loadChatsAsync())
    }, [])

    return ( 
        <div id="chatlist">
            {chats.map((chat) => {
                return <div>{chat.users.map((user) => user.display_name + " ")} </div>
            })}
        </div>
    )
}

export default ChatList