import { motion } from "motion/react"
import { useState, FormEvent } from "react";
import LoginForm from "./loginForm/LoginForm";
import './Login.css'
import { easeInOut } from "motion"
import { LogIn } from "../services/userService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setIsLoading } from "../store/isLoadingSlice";
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const isLoading = useSelector( (state: RootState) => state.isLoading.value)
    const dispatch = useDispatch()

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        // hit api here to verify log in. however we need to check whether the user already has a JWT when they get to this page
        // AND if they will be using a password OR one time use key to determine which endpoint to consume
        // here we probably need to somehow switch to a loading icon right?
        try {
            dispatch(setIsLoading(true))
            const jwt = await LogIn({username, password})
            console.log(jwt.Jwt)
        } catch (err) {
            dispatch(setIsLoading(false))
        } 
        
        // if valid we cache jwt here?
    }

    const handleUsernameInputChange = (username: string): void => {
        setUsername(username)
    }

    const handlePasswordInputChange = (password: string): void => {
        setPassword(password)
    }
    

    if (isLoading) {
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