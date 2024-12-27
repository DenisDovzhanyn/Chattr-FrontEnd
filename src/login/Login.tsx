import { motion } from "motion/react"
import { useState, ChangeEvent, FormEvent } from "react";
import LoginForm from "./loginForm/LoginForm";
import './Login.css'
import { easeInOut } from "motion"
import { LogIn } from "../services/userService";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usingKey, setUsingkey] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        // hit api here to verify log in. however we need to check whether the user already has a JWT when they get to this page
        // AND if they will be using a password OR one time use key to determine which endpoint to consume
        event.preventDefault()
        const jwt = await LogIn({username, password})
        console.log(jwt.jwt)
        // if valid we cache jwt here?
    }

    const handleUsernameInputChange = (username: string) => {
        setUsername(username)
    }

    const handlePasswordInputChange = (password: string) => {
        setPassword(password)
    }
    
    const handleUsingKeyChange = ({target: {checked}}: ChangeEvent<HTMLInputElement>) => {
        setUsingkey(checked)
    }
    return <div className="page">
        <motion.div 
        id="welcome"
        initial={{opacity: 0}} 
        animate={{opacity: [0.7, 1, 0.7]}}
        transition={{repeat: Infinity, duration: 2, ease: easeInOut}}>
            Chattr
        </motion.div>

        <LoginForm onSubmit={handleSubmit} onUsernameInputChange={handleUsernameInputChange}
         onPasswordInputChange={handlePasswordInputChange} onButtonPressKeyChange={handleUsingKeyChange}
         usingKey={usingKey}/>
       
    </div>
}

export default Login