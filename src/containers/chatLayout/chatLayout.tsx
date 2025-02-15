import './chatLayout.css'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store/store'
import { useMemo } from 'react'
import { calcTimeFull } from '../chatlist/ChatList'
function ChatLayout() {
    const {currentlySelected} = useSelector((state: RootState) => state.chats)
    
    const idToDisplay = useMemo(() => {
        const map = new Map<number, string>()
        currentlySelected?.users?.forEach(user => {
            map.set(user.id, user.display_name)
        });
        return map
    }, [currentlySelected])

    if (currentlySelected === undefined) return <div> Please Select A Chat</div>
    if (currentlySelected.messages === undefined || currentlySelected.messages.length == 0) return <div>no messages for chat {currentlySelected.chat_name}</div>
    return (
        <div id='chatlayout'>
            <h2>chat: {currentlySelected.chat_name}</h2>
            {currentlySelected.messages.map((message, index) => {
                if (index != 0 && currentlySelected.messages![index - 1].user_id === message.user_id) {
                    return <div className='messagebox'>
                        {message.content}
                        </div>
                }
                return <div className='messagebox' style={{marginTop: '20px'}}>
                    <div className='displayname'>
                        {idToDisplay.has(message.user_id) ? idToDisplay.get(message.user_id) : 'unknown user'}
                        <div className='messagetime'>
                            {calcTimeFull(message.inserted_at) + ' ago'}
                        </div>
                    </div>
                    {message.content}
                </div>
            })}
        </div>
    )
}

export default ChatLayout