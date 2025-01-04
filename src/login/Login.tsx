import { motion } from "motion/react"
import { useState, FormEvent } from "react";
import './Login.css'
import { easeInOut } from "motion"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { logInAsync } from "../store/userSlice";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const {isLoading} = useSelector( (state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>()

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        // hit api here to verify log in. however we need to check whether the user already has a JWT when they get to this page
        // AND if they will be using a password OR one time use key to determine which endpoint to consume
        // here we probably need to somehow switch to a loading icon right?
            dispatch(logInAsync({username, password}))
            // I guess if we are still here after this dispatch that means that it failed right?????
            setUsername('');
            setPassword('');
            // actually we probably want to display an error on the input fields or somewhere on page if we get here
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
        <div className="video-background">
            <video autoPlay loop muted playsInline>
            <source src="/loginBackground.mp4" type="video/mp4" />
            </video>
        </div>
        
        <motion.div id="loginForm">
            <img src="/chattrlogo.png" className="logo"/>
            <motion.img 
            src="/chattrlogotext.png"
            id="welcome"
            initial={{opacity: 0}} 
            animate={{opacity: [0.7, 1, 0.7]}}
            transition={{repeat: Infinity, duration: 2, ease: easeInOut}} />
                
            <form onSubmit={handleSubmit} id="form">
                <input className="input" type="text" name="username" placeholder="Username" onChange={(e) => handleUsernameInputChange(e.target.value)} required />
                <input className="input" type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={(e) => handlePasswordInputChange(e.target.value)} required />
                <label className="showpassword">
                    <input className="showpassword" type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                    Show password?
                </label>
                
                <button type="submit" disabled={!(username.trim() && password.trim())}>Log in</button>
            </form>
            <a id="forgotpassword">Forgot password?</a>
        </motion.div>
        
        <div id="registercontainer">
            <label>No account? <a id="signup">Sign up</a></label>
        </div>
       
    </div>
}

export default Login