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
        
    }

    throw new Error(errMessage)
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
                body: JSON.stringify(chat_name)
                
            }
        )

        return response
    } catch (err) {

    }
    throw new Error(errMessage)
}