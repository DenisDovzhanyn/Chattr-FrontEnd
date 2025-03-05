import {getTokenFromStorage} from "./store/userSlice"


export interface fetchWithAuthOptions extends RequestInit {
    headers: {
        [key: string]: string;
    }
}

export const fetchWithAuth = async (link: string, options: fetchWithAuthOptions) => {
    let errMessage = 'An unexpected error occured'

    let access = getTokenFromStorage()

    if (!access) throw new Error(errMessage)

    try {
        options.headers.Authorization = `Bearer ${access}`
        const response = await fetch(link, options)
        const jsonResponse = await response.json()

        if (response.ok) {
            return jsonResponse
        }
        errMessage = jsonResponse.error
        if (response.status == 401) {
            window.dispatchEvent(new CustomEvent('renewAccess', {
                detail: {
                    onFinish: async (token: string | null) => {
                        if (token) {
                            options.headers.Authorization = `Bearer ${access}`
                            const secondResponse = await fetch(link, options)
                            const secondJsonResponse = await secondResponse.json()
                            
                            if (secondResponse.ok) {
                                return secondJsonResponse
                            }
                            errMessage = secondJsonResponse.error
                        } 
                    } 
                }
                
            }))
            
        }
    } catch (err) {

    }

    throw new Error(errMessage)
    
}