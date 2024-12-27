type LoginForm = {
    username: string,
    password: string
}
export async function LogIn({username, password}:LoginForm) {
    const response = await fetch(`${import.meta.env.VITE_BASE_API}/api/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        }
    )
    if (response.ok) {
        const responseJson = await response.json()
        return responseJson
    } else {
        const error = await response.text()
        console.error('error while trying to login', error)
    }
}