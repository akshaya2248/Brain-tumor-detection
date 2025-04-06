import React, { useState, useRef } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import "../home.css";
import brain from "./brain.mp4";
import { db, storage } from "../firebase/firebase";
import {
  setDoc,
  doc,
  serverTimestamp,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { userLoggedIn } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
  
    if (password == confirmPassword) {
      try {
        await doCreateUserWithEmailAndPassword(email, password, name); // Pass name here
        const userDocRef = doc(db, "users", email);
        await setDoc(userDocRef, {
          email: email,
          name: name,
        });
        alert("Successfully created an account.");
      } catch (error) {
        console.error("Sign-in error:", error.message);
        alert("Sorry. something went wrong.");
      }
    } else {
      alert("password donot match");
    }
    setIsRegistering(false);
  };
  return (
    <>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}

      <div>
        {userLoggedIn && <Navigate to={"/home"} replace={true} />}
        <div class="parent">
          <div class="main-container">
            <div class="login-container">
              <h1>Create Account</h1>
              <form onSubmit={onSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  class="upload"
                  placeholder="Email"
                  required
                />
                <input
                  type="text"
                  class="upload"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  placeholder="Username"
                  required
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  class="upload"
                  placeholder="password"
                  required
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setconfirmPassword(e.target.value);
                  }}
                  class="upload"
                  placeholder="confirm password"
                  required
                />
                <button class="upload" type="submit" id="myButton">
                  {isRegistering ? "⏳" : "Signup 🔓"}
                </button>
              </form>

              <div>
                <br />
                Already a user?
                <Link to={"/login"}>Login here</Link>
              </div>
            </div>

            <div class="video-container">
              <video autoPlay={true} muted loop={true}>
                <source src={brain} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
