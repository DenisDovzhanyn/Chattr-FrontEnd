import './chatLayout.css'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store/store'
import { useEffect, useMemo, useRef, useState } from 'react'
import { calcTimeFull } from '../chatlist/ChatList'
import useWebSocket, {ReadyState} from 'react-use-websocket'
import Modal from '../modal/Modal'
import { addUserToChatAsync } from '../../store/chatSlice'
function ChatLayout() {
    const {currentlySelected, error} = useSelector((state: RootState) => state.chats)
    const {userId, access} = useSelector((state: RootState) => state.user)
    const [newMessage, setNewMessage] = useState('')
    const [addFriendModalState, setAddFriendModalState] = useState(false)
    const WS_URL = 'ws://localhost:4001/socket/websocket'
    const messageContainer = useRef<HTMLDivElement>(null)
    const {currTime} = useSelector((state: RootState) => state.app)
    const dispatch = useDispatch<AppDispatch>()
    const chatBoxInput = useRef<HTMLDivElement | null>(null)

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

        if (chatBoxInput.current) {
             chatBoxInput.current.innerHTML = ''
             setNewMessage('')
        }
        return map
    }, [currentlySelected])

    const handleAddUserSubmit = (username: string) => {
        dispatch(addUserToChatAsync(username))
    }

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
        if (messageContainer != null && messageContainer.current != null) {
            messageContainer.current.scrollTop = messageContainer.current.scrollHeight
        }
    }, [currentlySelected?.messages])
    if (currentlySelected === undefined) return <div> Please Select A Chat</div>
    return (

            <div id='chatlayout'>
                <Modal openState={addFriendModalState} 
                setOpenState={setAddFriendModalState} 
                inputLabel='Username' 
                buttonLabel='Add User' 
                handleSubmit={handleAddUserSubmit}
                closeOnSubmit={false}
                error={error}
                />
                <div id='chattop'>
                    <h2 id='chatname'>
                        chat: {currentlySelected.chat_name} 
                    </h2>
                    <button id='adduser' className='addusersize' onClick={() => setAddFriendModalState(true)}>
                        <svg className='addusersize' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                            <path id='addusersvg' fill="#dddddd" d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM504 312l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
                        </svg>
                    </button>
                </div>
                <div id='messagecontainer' ref={messageContainer}>
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
                    <div id='chatboxcontent' ref={thing => {
                        thing?.focus()
                        chatBoxInput.current = thing
                    }} contentEditable="plaintext-only" onKeyUp={onMessageSend} onKeyDown={(e) => {if(e.key === 'Enter' ) 
                        e.preventDefault()
                        return false
                    }}>
                    </div>
                </div>
            </div>
            

        
    )
}

export default ChatLayout