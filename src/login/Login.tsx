import { motion } from "motion/react"
import { useState, ChangeEvent, FormEvent } from "react";
import LoginForm from "./loginForm/LoginForm";
import './Login.css'
import { easeInOut } from "motion"
import { LogIn } from "../services/userService";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        // hit api here to verify log in. however we need to check whether the user already has a JWT when they get to this page
        // AND if they will be using a password OR one time use key to determine which endpoint to consume
        setSubmitting(true)
        // here we probably need to somehow switch to a loading icon right?
        try {
            const jwt = await LogIn({username, password})
            console.log(jwt.Jwt)
        } catch (err) {
            setSubmitting(false);
        } 
        
        // if valid we cache jwt here?
    }

    const handleUsernameInputChange = (username: string): void => {
        setUsername(username)
    }

    const handlePasswordInputChange = (password: string): void => {
        setPassword(password)
    }
    

    if (isSubmitting) {
        return <div>hello me so skibidi</div>
    }
    return <div className="page" id="loginpage">
        <motion.div 
        id="welcome"
        initial={{opacity: 0}} 
        animate={{opacity: [0.7, 1, 0.7]}}
        transition={{repeat: Infinity, duration: 2, ease: easeInOut}}>
            Chattr
        </motion.div>

        <LoginForm onSubmit={handleSubmit} onUsernameInputChange={handleUsernameInputChange}
         onPasswordInputChange={handlePasswordInputChange}/>
       
    </div>
}

export default Login