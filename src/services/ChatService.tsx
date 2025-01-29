import { fetchWithAuth } from "../FetchWrapper"

export async function getChats( access_token: string ) {
    let errMessage = 'Internal server error'
    try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_BASE_API}/api/chats`,
            {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + access_token
                } 
            }
        )

        return response
    } catch (err) {
        
    }

    throw new Error(errMessage)
}