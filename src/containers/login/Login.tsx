import { motion } from "motion/react";
import { useState, FormEvent } from "react";
import "./Login.css";
import { easeInOut } from "motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { logInAsync, setKeepLoggedIn } from "../../store/userSlice";
import { Navigate } from "react-router-dom";


function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const { isLoading, error, keepLoggedIn, access } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        // hit api here to verify log in. however we need to check whether the user already has a JWT when they get to this page
        // AND if they will be using a password OR one time use key to determine which endpoint to consume
        // here we probably need to somehow switch to a loading icon right?
        dispatch(logInAsync({ username, password, keepLoggedIn }));
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

    if (access) return <Navigate to='/homepage' />
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
                    <label className="loginlabel">
                        Username
                        <input
                            className="input"
                            type="text"
                            name="username"
                            onChange={(e) =>
                                handleUsernameInputChange(e.target.value)
                            }
                            style={{border: error ? '1px solid #ff6e6e' : ''}}
                            required
                        />
                    </label>
                    <label className="loginlabel">
                        Password
                        <div id="passwordfield">
                            <input
                                className="input"
                                id="passwordinput"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                onChange={(e) =>
                                    handlePasswordInputChange(e.target.value)
                                }
                                style={{
                                    borderTop: error ? '1px solid #ff6e6e' : '',
                                    borderLeft: error ? '1px solid #ff6e6e' : '',
                                    borderBottom: error ? '1px solid #ff6e6e' : ''
                                }}
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} id="showpassbutton" 
                                style={{borderTop: error ? '1px solid #ff6e6e' : '',
                                    borderRight: error ? '1px solid #ff6e6e' : '',
                                    borderBottom: error ? '1px solid #ff6e6e' : ''
                                }}>
                                {showPassword ? 
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" id="showpassword">
                                    <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"/>
                                </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" id="showpassword">
                                    <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z"/>
                                </svg>
                                }
                            </button>
                        </div>
                    </label>
                    
                    <label className="checkboxtext">
                        <input
                        type="checkbox"
                        checked={keepLoggedIn}
                        onChange={ () => dispatch(setKeepLoggedIn())}
                        />
                        Keep me logged in
                        
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