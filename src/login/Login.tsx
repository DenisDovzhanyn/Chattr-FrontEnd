import { motion } from "motion/react";
import { useState, FormEvent } from "react";
import "./Login.css";
import { easeInOut } from "motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { logInAsync } from "../store/userSlice";


function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const { isLoading, error } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        // hit api here to verify log in. however we need to check whether the user already has a JWT when they get to this page
        // AND if they will be using a password OR one time use key to determine which endpoint to consume
        // here we probably need to somehow switch to a loading icon right?
        dispatch(logInAsync({ username, password }));
        // I guess if we are still here after this dispatch that means that it failed right?????
        // actually we probably want to display an error on the input fields or somewhere on page if we get here
        // if valid we cache jwt here?
    };

    const handleUsernameInputChange = (username: string): void => {
        setUsername(username);
    };

    const handlePasswordInputChange = (password: string): void => {
        setPassword(password);
    };

    return (
        <div className="page" id="loginpage">
            <div className="video-background">
                <video autoPlay loop muted playsInline>
                    <source src="/loginBackground.mp4" type="video/mp4" />
                    Your browser does not support the video tag
                </video>
            </div>

            <div id="loginForm">
                <div className="logo">
                    <img src="/chattrlogo.png" id="logophoto" />
                    <motion.img
                        src="/chattrlogotext.png"
                        id="logotext"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: easeInOut,
                        }}
                    />
                </div>

                <form onSubmit={handleSubmit} id="form">
                    <input
                        className="input"
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={(e) =>
                            handleUsernameInputChange(e.target.value)
                        }
                        required
                    />
                    <input
                        className="input"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        onChange={(e) =>
                            handlePasswordInputChange(e.target.value)
                        }
                        required
                    />
                    <label className="showpassword">
                        <input
                            className="showpassword"
                            type="checkbox"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                        />
                        Show password?
                    </label>

                    <motion.button
                        style={{ backgroundColor: isLoading ? "#d3d3ff" : "" }}
                        whileTap={
                            !(username.trim() && password.trim())
                                ? undefined
                                : { scale: 0.85 }
                        }
                        type="submit"
                        disabled={!(username.trim() && password.trim())}
                    >
                        {isLoading ? (
                            <motion.svg
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2,
                                    ease: "linear",
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                id="loading"
                            >
                                <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
                            </motion.svg>
                        ) : (
                            <>Log in</>
                        )}
                    </motion.button>
                </form>
                {error.length ? <p id="incorrectlogin">{error}</p> : <></>}
                <a id="forgotpassword">Forgot password?</a>
            </div>

            <div id="registercontainer">
                <label>
                    No account? <a id="signup">Sign up</a>
                </label>
            </div>
        </div>
    );
}

export default Login