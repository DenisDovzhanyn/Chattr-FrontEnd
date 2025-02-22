import { useEffect, useRef, useState } from 'react'
import './ChatList.css'
import { createNewChatAsync, loadChatsAsync, selectChatAsync, addMessageToChat } from '../../store/chatSlice'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store/store'
import useWebSocket, {ReadyState} from 'react-use-websocket'

export const calcTime = (timestamp: number) => {
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

export const calcTimeFull = (timestamp: number) => {
    const now = Date.now()
    const past = new Date(timestamp)

    const seconds = Math.floor((now - past.getTime()) / 1000)
    if (seconds < 60) return `${seconds} seconds`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minutes`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hours`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days} days`
    const weeks = Math.floor(days / 7)
    return `${weeks} weeks`
}
interface Msg {
    event: string,
    payload: {
        [key: string]: any
    },
    topic: string
}
function ChatList() {
    const {chats} = useSelector((state: RootState) => state.chats)
    const {access, userId} = useSelector((state: RootState) => state.user) 
    const dispatch = useDispatch<AppDispatch>()
    const [createChatModalOpen, setCreateChatModalOpen] = useState(false);
    const [newChatName, setNewChatName] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const amountOfChats = useRef(chats.length)
    const WS_URL = 'ws://localhost:4001/socket/websocket'

    const {sendJsonMessage, lastJsonMessage, readyState} = useWebSocket(
        WS_URL,
        {
            queryParams: {token: access!},
            shouldReconnect: () => true,
            share: true
        }
    )

    useEffect(() => {

        dispatch(loadChatsAsync())
    }, [])
    
    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
            chats.forEach((chat) => {
                sendJsonMessage({
                    topic: "chat:" + chat.id,
                    event: "phx_join",
                    payload: {},
                    ref: userId
                })
                console.log('connecting to chat' + chat.id)
            })
        }
    }, [readyState])

    useEffect(() => {
        if (readyState === ReadyState.OPEN && amountOfChats.current < chats.length) {
            sendJsonMessage({
                topic: "chat:" + chats[0].id,
                event: "phx_join",
                payload: {},
                ref: userId
            })
        }
    }, [chats])

    useEffect(() => {
        
        if (lastJsonMessage !== null) {
            console.log(lastJsonMessage)
            const msg = lastJsonMessage as Msg
            
            if (msg.event === "new_msg") {
                const chat_id = Number(msg.topic.substring(5))
                dispatch(addMessageToChat({chat_id: chat_id, message: msg.payload.message}))
            }
        }
    }, [lastJsonMessage])
    useEffect(() => {
        if (createChatModalOpen && inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, [createChatModalOpen]);
    
    return ( 
        <div id="chatlist">

            <div id='modalbackground' style={{display: createChatModalOpen ? 'block' : 'none'}} />
            <dialog open={createChatModalOpen} id='createchatmodal'>
                <button onClick={() => (setCreateChatModalOpen(false))} id='modalexitbutton'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" id='exitsvg'>
                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                    </svg>
                </button>

                <label id='createchatlabel'>
                    Chat name
                    <input onChange={(e) => setNewChatName(e.target.value)} 
                        className='input'
                        id='chatnameinput'
                        type='text' 
                        value={newChatName}
                        ref={inputRef}
                        required
                    />
                </label>

                <button id='modalbutton' disabled = {newChatName ? false : true} onClick={(event) => {
                    event.preventDefault()
                    dispatch(createNewChatAsync(newChatName))
                    setCreateChatModalOpen(false)
                    setNewChatName('')
                    amountOfChats.current += 1
                }}>
                    Create Chat
                </button>


            </dialog>
            
            <button id='createchat' className='chatlistbutton' onClick={() => {
                setCreateChatModalOpen(true)
            }}>
                Create new chat
            </button>
            <button id='findrandomchat' className='chatlistbutton' >
                Find random chat
            </button>
            <div>
                Chats
            </div>
            {chats.map((chat) => {
                return <button className='chat' key={chat.id} onClick={() => dispatch(selectChatAsync(chat.id))}>
                    <div className='chatname'>
                        {chat.chat_name}
                    </div> 
                    {calcTime(chat.last_msg_time)} 
                </button>
            })}
        </div>
        
    )
}

export default ChatList