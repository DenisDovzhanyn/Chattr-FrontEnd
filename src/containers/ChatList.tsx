import { useEffect, useState } from 'react'
import './ChatList.css'
import { loadChatsAsync } from '../store/chatSlice'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'

const calcTime = (timestamp: number) => {
    const now = Date.now()
    const past = new Date(timestamp)

    const seconds = Math.floor((now - past.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d`
    const weeks = Math.floor(days / 7)
    return `${weeks}w`
}
function ChatList() {
    const {chats} = useSelector((state: RootState) => state.chats)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {

        dispatch(loadChatsAsync())
    }, [])

    return ( 
        <div id="chatlist">
            {chats.map((chat) => {
                return <div className='chat'>
                    <div className='chatname'>
                        {chat.chat_name}
                    </div> 
                    {calcTime(chat.last_msg_time)} 
                </div>
            })}
        </div>
    )
}

export default ChatList