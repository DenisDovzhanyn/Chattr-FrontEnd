import { motion } from "motion/react"
import { FormEvent, ChangeEvent } from "react"

type LoginForm = {
    onSubmit: (event: FormEvent) => void
    onUsernameInputChange: (username: string) => void
    onPasswordInputChange: (password: string) => void
    onButtonPressKeyChange: (event: ChangeEvent<HTMLInputElement>) => void
    usingKey: boolean
}

function LoginForm({onSubmit, onUsernameInputChange, onPasswordInputChange, onButtonPressKeyChange, usingKey}: LoginForm ) {
    return <motion.div id="loginForm">
        <form onSubmit={onSubmit}>
            <input type="text" name="username" placeholder="Username" onChange={(e) => onUsernameInputChange(e.target.value)} required></input>
            <input type="password" name="password" placeholder="Password" onChange={(e) => onPasswordInputChange(e.target.value)} required></input>
            <input type="checkbox" name="usingKey" placeholder="Using one time key?" onChange={onButtonPressKeyChange} checked={usingKey}></input>
            <button type="submit">Log in</button>
        </form>
    </motion.div>
}

export default LoginForm