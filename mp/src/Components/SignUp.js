import React from 'react'
import "../Style/SignUp.css";
import myImage from '../Images/image1.png'; 
import googleLogo from '../Images/google.png';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from "axios";
function SignUp() {
  const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pswd, setPswd] = useState("");
    const [Rpswd, setRPswd] = useState("");
    const [message, setMessage] = useState("");

    const handleSignup = async () => {
      if (name === "" || email === "" || pswd === "" || Rpswd === "") {
        console.log("Please fill all details");
        return;
      }
      
      if (pswd !== Rpswd) {  // Fix: Use !== instead of ==!
          console.log("Password mismatch");
          return;
      }
      
      try {
          const response = await axios.post("http://127.0.0.1:5000/signup", { name, email, pswd });
          setMessage(response.data.message);
      } catch (error) {
          setMessage("Signup failed: " + (error.response?.data?.error || "Unknown error"));
      }
    
    };

  function handleLogin(){
    navigate('/login');
  }

  return (
    <div className='out-container'>
        <div className='left'>
          <img className='leftImg'src={myImage} />
        </div>

        <div className='right'>
          <div className='innerRight'>
            <div style={{ fontSize: "32px", fontWeight: "bold" }}> Signup</div>
            <p style={{ fontSize: "12px" , marginTop :"10px", marginBottom :"10px"}}>Just some details to get you in.!</p>

          <form>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) => setPswd(e.target.value)} 
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              onChange={(e) => setRPswd(e.target.value)}
            />

            <button 
              className='signupButton' 
              onClick={handleSignup}
            >Signup</button>
            
            <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
              <hr style={{ flex: 1, border: "1px solid black" }} />
              <span style={{ margin: "0 10px" }}>or</span>
              <hr style={{ flex: 1, border: "1px solid black" }} />
            </div>

            <button className='cntButton'>
              <img src={googleLogo} alt="Google" style={{ width: "15px", height: "15px", paddingRight: "10px" ,paddingTop:"5px"}} />
                 Continue with google
            </button>

        </form>
         <p className='AldReg'>Already Registered?
          <button 
          className='loginButton'
          onClick={handleLogin}
          >Login</button>
          </p>

         <div className='termCond'>
          <button  className='tdsc'>Terms & Conditions</button>
          <button className='tdsc'>Support</button>
          <button  className='tdsc'>Customer Care</button>
         </div>
          
          </div>
        </div>
        
    </div>
    
  )
}

export default SignUp