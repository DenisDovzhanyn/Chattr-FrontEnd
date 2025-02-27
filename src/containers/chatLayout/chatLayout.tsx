import './chatLayout.css'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store/store'
import { useEffect, useMemo, useRef, useState } from 'react'
import { calcTimeFull } from '../chatlist/ChatList'
import useWebSocket, {ReadyState} from 'react-use-websocket'
function ChatLayout() {
    const {currentlySelected} = useSelector((state: RootState) => state.chats)
    const {userId, access} = useSelector((state: RootState) => state.user)
    const [newMessage, setNewMessage] = useState('')
    const WS_URL = 'ws://localhost:4001/socket/websocket'
    const chatbox = useRef<HTMLDivElement>(null)
    const {currTime} = useSelector((state: RootState) => state.app)

    const {sendJsonMessage} = useWebSocket(
        WS_URL,
        {
            queryParams: {token: access!},
            shouldReconnect: () => true,
            share: true
        }
    )
    
    const idToDisplay = useMemo(() => {
        const map = new Map<number, string>()
        currentlySelected?.users?.forEach(user => {
            map.set(user.id, user.display_name)
        });
        return map
    }, [currentlySelected])

    const onMessageSend = (e: any) => {
        if (e.key === 'Enter') {
            sendJsonMessage({
                topic: "chat:" + currentlySelected?.id,
                event: "new_msg",
                payload: {
                    content: newMessage
                },
                ref: userId
            })
            //@ts-ignore
            e.target.innerHTML = ""
            setNewMessage("")
            return false
        } else {
            //@ts-ignore
            setNewMessage(e.target.innerHTML)
        }
    }

    useEffect(() => {
        if (chatbox != null && chatbox.current != null) {
            chatbox.current.scrollTop = chatbox.current.scrollHeight
        }
    }, [currentlySelected?.messages])
    if (currentlySelected === undefined) return <div> Please Select A Chat</div>
    return (

            <div id='chatlayout'>
                <h2 id='chatname'>chat: {currentlySelected.chat_name}</h2>
                <div id='messagecontainer' ref={chatbox}>
                    {currentlySelected.messages!.map((message, index) => {
                            // wow this is disgusting
                        if (index != 0 
                            && currentlySelected.messages![index - 1].user_id === message.user_id 
                            && (Math.floor((new Date(message.inserted_at).getTime() - new Date(currentlySelected.messages![index - 1].inserted_at).getTime()) / 1000)) < 300) {
                            return <div className='messagebox'>
                                {message.content}
                                </div>
                        }

                        return <div className='messagebox' style={{marginTop: '20px'}}>
                            <div className='displayname'>
                                {idToDisplay.has(message.user_id) ? idToDisplay.get(message.user_id) : 'unknown user'}
                                <div className='messagetime'>
                                    {calcTimeFull(message.inserted_at, currTime) + ' ago'}
                                </div>
                            </div>
                            {message.content}
                        </div>
                    })}
                </div>

                <div id='chatbox'>
                    <div id='chatboxcontent' contentEditable="plaintext-only" onKeyUp={onMessageSend} onKeyDown={(e) => {if(e.key === 'Enter' ) 
                        e.preventDefault()
                        return false
                    }}>
                        
                    </div>
                </div>
            </div>
            

        
    )
}

export default ChatLayout