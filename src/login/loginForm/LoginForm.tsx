import { motion, easeInOut } from "motion/react"
import { FormEvent, ChangeEvent, useState } from "react"
import './LoginForm.css'

type LoginForm = {
    onSubmit: (event: FormEvent) => void
    onUsernameInputChange: (username: string) => void
    onPasswordInputChange: (password: string) => void
}
function LoginForm({onSubmit, onUsernameInputChange, onPasswordInputChange }: LoginForm ) {
    const [showPassword, setShowPassword] = useState(false);

    return <motion.div id="loginForm">
        <motion.div 
         id="welcome"
         initial={{opacity: 0}} 
         animate={{opacity: [0.7, 1, 0.7]}}
         transition={{repeat: Infinity, duration: 2, ease: easeInOut}}>
             Chattr
        </motion.div>

        <form onSubmit={onSubmit} id="form">
            <input className="input" type="text" name="username" placeholder="Username" onChange={(e) => onUsernameInputChange(e.target.value)} required />
            <input className="input" type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={(e) => onPasswordInputChange(e.target.value)} required />
            <label>
                <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                show Password?
            </label>
            
            <button type="submit">Log in</button>
        </form>
        <div id="OR">
            <div className="line" />
            OR
            <div className="line" />
        </div>
    </motion.div>
}

export default LoginForm