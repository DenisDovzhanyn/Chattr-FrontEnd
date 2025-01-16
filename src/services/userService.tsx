export type LoginForm = {
    username: string,
    password: string
}
export async function LogIn({username, password}:LoginForm) {
    let errMessage = 'Internal server error'
    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_API}/api/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ username, password })
            }
        )

        if (response.ok) {
            const responseJson = await response.json()
            return responseJson
        } 

        const responseJson = await response.json()
        errMessage = responseJson.error
    
        
    } catch(err) {
        
    }

    throw new Error(errMessage)
    
}