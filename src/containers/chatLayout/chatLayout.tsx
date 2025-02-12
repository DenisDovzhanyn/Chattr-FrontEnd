import './chatLayout.css'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store/store'
import { useEffect, useState } from 'react'
import { getChatMessages } from '../../services/ChatService'

interface Message {
    id: number,
    content: string,
    chat_id: number,
    inserted_at: number
}

function ChatLayout() {
    const {currentlySelected} = useSelector((state: RootState) => state.chats)
    const [messages, setMessages] = useState<Message[]>([])
    

    useEffect(() => {
        const getChats = async () => {
            if(currentlySelected) {
                const chat = await getChatMessages(currentlySelected)
                setMessages(chat.messages)
            }
        }
        getChats()
    }, [currentlySelected])

    if (!currentlySelected) return <div> Please Select A Chat</div>
    if(messages.length == 0) return <div>no messages for chat {currentlySelected}</div>
    return (
        <div id='messages'>
            <h2>chat: {currentlySelected}</h2>
            {messages.map((message) => {
                return <div>{message.content}</div>
            })}
        </div>
    )
}

export default ChatLayout