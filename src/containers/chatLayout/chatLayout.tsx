import './chatLayout.css'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store/store'
import { useEffect, useState } from 'react'
import { getChatMessages } from '../../services/ChatService'



function ChatLayout() {
    const {currentlySelected} = useSelector((state: RootState) => state.chats)
    
    
    

    // useEffect(() => {
    //     const getChats = async () => {
    //         if(currentlySelected) {
    //             const chat = await getChatMessages(currentlySelected)
    //             setMessages(chat.messages)
    //         }
    //     }
    //     getChats()
    // }, [currentlySelected])

    if (currentlySelected === undefined) return <div> Please Select A Chat</div>
    if(currentlySelected.messages === undefined || currentlySelected.messages.length == 0) return <div>no messages for chat {currentlySelected.chat_name}</div>
    return (
        <div id='messages'>
            <h2>chat: {currentlySelected.chat_name}</h2>
            {currentlySelected.messages.map((message) => {
                return <div>{message.content}</div>
            })}
        </div>
    )
}

export default ChatLayout