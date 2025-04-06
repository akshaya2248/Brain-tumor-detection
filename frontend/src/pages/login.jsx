import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../firebase/auth";
import { useAuth } from "../context/";
import "../home.css";
import brain from "./brain.mp4";
const Login = () => {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSigningIn(true);

    if (!isSigningIn) {
      try {
        await doSignInWithEmailAndPassword(email, password);
        alert("Logged in.");
      } catch (error) {
        console.error("Sign-in error:", error.message);
        alert("please try again with correct credentials.");
      } finally {
      }
    }
    setIsSigningIn(false);
  };

  return (
    <div>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}
      <div class="parent">
        <div class="main-container">
          <div class="login-container">
            <h1>Login Here</h1>
            <form onSubmit={onSubmit}>
              <input
                type="text"
                class="upload"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="Email"
              />
              <input
                type="password"
                class="upload"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="password"
              />
              <button class="upload" type="submit" id="myButton">
                {isSigningIn ? "⏳" : "Login 🔓"}
              </button>
            </form>
            <br />
            <div>
              New here?
              <Link to={"/register"}>Signup here</Link>
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
  );
};

export default Login;
