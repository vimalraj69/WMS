import React from 'react'
import "../Style/Login.css";
import myImage from '../Images/image1.png';
import googleLogo from '../Images/google.png';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';
function Login() {
    const nav = useNavigate();

    const [email, setEmail] = useState("");
    const [pswd, setPswd] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();
        if (email === "" || pswd === "") {
            setMessage("Please fill all details");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:5000/login", { email, pswd });

            if (response.status === 200) {
                setMessage(response.data.message);
                nav('/DashBoard');
                // Save user data in local storage or state for further use
                localStorage.setItem("user", JSON.stringify(response.data.user));
            }
        } catch (error) {
            setMessage(error.response?.data?.error || "Login failed");
        }
    };

    function handleSubmit(){
        nav('/ForgotPassword');
    }
    return (
        <div className='out-container'>
            <div className='left'>
                <img className='leftImg' src={myImage} />
            </div>
            <div className='right'>
                <div className='innerRight'>
                    <h1 className='signup'>Login </h1>
                    <p style={{marginTop:"20px",marginBottom :"20px"}}>Glad you’re back.!</p>

                    <form>
                        <input
                            type="text"
                            name="username"
                            placeholder="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={(e) => setPswd(e.target.value)} 
                        />

                        <div className="checkBox">
                            <label><input type="checkbox" />Remember me</label>
                        </div>

                        <button className='signupButton'onClick={handleLogin} >Login</button>

                        <div className="forgot-password">
                            <button
                            className='fpswd'
                            onClick={handleSubmit}
                            >Forgot password?</button>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
                            <hr style={{ flex: 1, border: "1px solid black" }} />
                            <span style={{ margin: "0 10px" }}>or</span>
                            <hr style={{ flex: 1, border: "1px solid black" }} />
                        </div>

                        <button className='cntButton'
                            
                        >
                            <img src={googleLogo} alt="Google" style={{ width: "15px", height: "15px", paddingRight: "10px", paddingTop: "5px" }} />
                            Continue with google
                        </button>
                    </form>


                </div>
            </div>
           
        </div>
    )
}

export default Login