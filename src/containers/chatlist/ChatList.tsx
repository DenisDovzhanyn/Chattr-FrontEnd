import { useEffect, useRef, useState } from 'react'
import './ChatList.css'
import { createNewChatAsync, loadChatsAsync } from '../../store/chatSlice'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store/store'
import { blockquote, create } from 'motion/react-client'

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
    const [createChatModalOpen, setCreateChatModalOpen] = useState(false);
    const [newChatName, setNewChatName] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {

        dispatch(loadChatsAsync())
    }, [])
    
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

                <label id='createchatlabel'>
                    Chat name
                    <input onChange={(e) => setNewChatName(e.target.value)} 
                        className='input' 
                        type='text' 
                        value={newChatName}
                        ref={inputRef}
                        required
                    />
                </label>

                <div id='modalbuttoncontainer'>
                    <button onClick={() => (setCreateChatModalOpen(false))}>
                        close
                    </button>
                    <button disabled = {newChatName ? false : true} onClick={(event) => {
                        event.preventDefault()
                        dispatch(createNewChatAsync(newChatName))
                        setCreateChatModalOpen(false)
                        setNewChatName('')
                    }}>
                        Create Chat
                    </button>
                </div>

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
                return <div className='chat' key={chat.id}>
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