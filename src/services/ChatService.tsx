import { fetchWithAuth } from "../FetchWrapper"

export async function getChats() {
    let errMessage = 'Internal server error'
    try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_BASE_API}/api/chats`,
            {
                method: 'GET',
                headers: {
                    
                } 
            }
        )

        return response
    } catch (err) {
        if(err instanceof Error) errMessage = err.message
    }

    throw new Error(errMessage)
}

export async function getChatMessages(chat_id: number) {
    let errMessage = 'Internal server error'

    try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_BASE_API}/api/chats/messages?chat_id=${chat_id}`,
            {
                method: 'GET',
                headers: {

                }
            }
        )

        return response
    } catch (err) {
        if (err instanceof Error) errMessage = err.message
    }
    throw new Error(errMessage)

}
// chat_id and user_id needed
// fuck
export async function addUserToChat() {

}

export async function createChat(chat_name: string) {
    let errMessage = 'Internal server error'
    try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_BASE_API}/api/chats`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({chat_name: chat_name})
                
            }
        )

        return response
    } catch (err) {
        if (err instanceof Error) errMessage = err.message
    }
    throw new Error(errMessage)
}