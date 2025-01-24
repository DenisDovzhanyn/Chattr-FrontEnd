
import { store } from "./store/store"
import { clearUserData, renewAccessAsync, setError } from "./store/userSlice"


export interface fetchWithAuthOptions extends RequestInit {
    headers: {
        Authorization: string;
        [key: string]: string;
    }
}

export const fetchWithAuth = async (link: string, options: fetchWithAuthOptions) => {
    const {dispatch, getState} = store
    try {
        const response = await fetch(link, options)
        const jsonResponse = await response.json()

        if (response.ok) {
            return jsonResponse
        }
        // this is pretty much a safeguard in case the refresh token isnt 
        // auto renewed by back end OR if our auto access refresher on the front end
        // fails( meaning our refresh is exp without being refreshed for some reason)
        if (response.status == 401) {
            
            const state = getState()

            await dispatch(renewAccessAsync())
            //if there is no access after this, then redux has automatially cleared user data
            const {access} = state.user

            let errMessage = 'An unexpected error occured'

            if (access) {
                options.headers.Authorization = `Bearer ${access}`
                const secondResponse = await fetch(link, options)
                const secondJsonResponse = await secondResponse.json()
                
                if (secondResponse.ok) {
                    return secondJsonResponse
                }
                errMessage = secondJsonResponse.error
            } 

            

            dispatch(clearUserData())
            throw new Error(errMessage)
        }
    } catch (err) {
        dispatch(setError(err))
    }
    
}