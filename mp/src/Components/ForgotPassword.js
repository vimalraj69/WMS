import React from 'react'
import "../Style/ForgotPassword.css";
import myImage from '../Images/image1.png';

function ForgotPassword() {
    return (
        <div className='out-container'>
            <div className='left'>
                <img className='leftImg' src={myImage} />
            </div>
            <div className='right'>
                <div className='innerRight'>
                    <h1 className='signup'>Forgot Password ?</h1>
                    <p style={{marginTop:"20px", marginBottom:"20px"}}>Please enter you’re email</p>

                    <form>
                        <input
                            type="text"
                            name="username"
                            placeholder="example@mail.com"
                        />

                        <button className='signupButton'>Reset Password</button>
                    </form>


                </div>
            </div>

        </div>
    )
}

export default ForgotPassword