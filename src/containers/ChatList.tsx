import { useEffect, useState } from 'react'
import './ChatList.css'
import { getChats } from '../services/ChatService'
import { useSelector, UseSelector } from 'react-redux'
import { RootState } from '../store/store'

type chat = {
    id: number,
    last_msg_time: number
    users: user[]
}
type user = {
    display_name: string,
    id: number
}

function ChatList() {
    const [chatlist, updatechatlist] = useState<chat[]>([])
    const {access} = useSelector((state: RootState) => state.user)

    useEffect(() => {
        const getChat = async () => {
            let chats
            if (access) chats = await getChats(access)
            
            updatechatlist(chats.chats || [])
        }
        
        getChat()
    }, [])

    return ( 
        <div id="chatlist">
            {chatlist.map((chat) => {
                return <div>{chat.users.map((user) => user.display_name + " ")} </div>
            })}
        </div>
    )
}

export default ChatList