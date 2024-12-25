import { motion } from "motion/react"
import { useState } from "react";
import LoginForm from "./loginForm/LoginForm";
import './Login.css'
import { easeInOut } from "motion"
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usingKey, setUsingkey] = useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        // hit api here to verify log in. however we need to check whether the user already has a JWT when they get to this page
        // AND if they will be using a password OR one time use key to determine which endpoint to consume
        event.preventDefault()
        console.log({username, password})
    }

    const handleUsernameInputChange = (username: string) => {
        setUsername(username)
    }

    const handlePasswordInputChange = (password: string) => {
        setPassword(password)
    }
    
    const handleUsingKeyChange = () => {
        setUsingkey(!usingKey)
    }

    return <div className="page">
        <motion.div 
        id="welcome"
        initial={{opacity: 0}} 
        animate={{opacity: [0.7, 1, 0.7]}}
        transition={{repeat: Infinity, duration: 2, ease: easeInOut}}>
            Chattr
        </motion.div>

        <LoginForm onSubmit={handleSubmit} onUsernameInputChange={handleUsernameInputChange} onPasswordInputChange={handlePasswordInputChange}/>
       
    </div>
}

export default Login