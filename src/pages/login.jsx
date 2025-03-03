import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { doSignInWithEmailAndPassword } from '../firebase/auth'
import { useAuth } from '../context/'
import '../home.css'
import brain from '../assets/brain.png'
import gridbox from '../assets/gridbox.png'
import molecule from '../assets/molecule.png'
import pinkball from '../assets/pinkball.png'

const Login = () => {
    const { userLoggedIn } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')



    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            await doSignInWithEmailAndPassword(email, password);
        } catch (error) {
            console.error("Sign-in error:", error.message);
            alert("Please check email and password.");
        }
    }

    return (
        <div>
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}
            <div class="parent">

                <div class="child">
                    <div class="left">
                        <h3>BRAIN TUMOR DETECTION</h3>
                        <br />
                        <h4>I am a Deep learning model. I can classify brain tumors upto 4 types. Try me out!</h4>
                        <br />
                        <br />

                        <Link to={'/register'}> <button class="upload">
                            Create an account here 📝
                        </button>
                        </Link>


                    </div>
                    <div class="right">
                        <form onSubmit={onSubmit}>
                            <input type="text" class="upload" onChange={(e) => { setEmail(e.target.value) }} placeholder="Email" />
                            <input type="password" class="upload" onChange={(e) => { setPassword(e.target.value) }} placeholder="password" />
                            <button class="upload" type="submit">
                                Login 🔓
                            </button>
                        </form>

                    </div>
                    <div class="pinkball">
                        <img src={pinkball} alt="" srcset="" />
                    </div>

                    <div class="molecule">
                        <img src={molecule} alt="" srcset="" />
                    </div>

                    <div class="gridbox">
                        <img src={gridbox} alt="" srcset="" />
                    </div>

                    <div class="brain">
                        <img src={brain} alt="" srcset="" />
                    </div>




                </div>
            </div>
        </div>
    )
}

export default Login