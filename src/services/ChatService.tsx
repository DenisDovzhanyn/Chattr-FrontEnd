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