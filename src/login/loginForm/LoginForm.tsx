import { motion } from "motion/react"
import { FormEvent, ChangeEvent } from "react"
import './LoginForm.css'

type LoginForm = {
    onSubmit: (event: FormEvent) => void
    onUsernameInputChange: (username: string) => void
    onPasswordInputChange: (password: string) => void
}
function LoginForm({onSubmit, onUsernameInputChange, onPasswordInputChange, }: LoginForm ) {
    return <motion.div id="loginForm">
        <form onSubmit={onSubmit} id="form">
            <input type="text" name="username" placeholder="Username" onChange={(e) => onUsernameInputChange(e.target.value)} required></input>
            <input type="password" name="password" placeholder="Password" onChange={(e) => onPasswordInputChange(e.target.value)} required></input>
            <button type="submit">Log in</button>
        </form>
    </motion.div>
}

export default LoginForm