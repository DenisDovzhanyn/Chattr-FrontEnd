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
        throw new Error('invalid');
    }
}