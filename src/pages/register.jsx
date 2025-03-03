import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import { db } from "../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";
import "../home.css";
import brain from "../assets/brain.png";
import gridbox from "../assets/gridbox.png";
import molecule from "../assets/molecule.png";
import pinkball from "../assets/pinkball.png";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phonenumber, setPhone] = useState("");
  const { userLoggedIn } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!/^[0-9]{10}$/.test(phonenumber)) {
      alert("Phone number must be exactly 10 digits");
      return;
    }
    try {
      await doCreateUserWithEmailAndPassword(email, password);
      await setDoc(doc(db, "users", email), {
        name,
        phonenumber,
      });
      alert("Successfully created account");
      navigate("/home");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/home"} replace />}
      <div className="parent">
        <div className="child">
          <div className="left">
            <h3>BRAIN TUMOR DETECTION</h3>
            <p>
              I am a Deep Learning model. I can classify brain tumors into 4
              types. Try me out!
            </p>
            <Link to={"/login"}>
              <button className="upload">Already have an account?</button>
            </Link>
          </div>
          <div className="right">
            <form onSubmit={onSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="upload"
                placeholder="Email"
                required
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="upload"
                placeholder="Name"
                required
              />
              <input
                type="text"
                value={phonenumber}
                onChange={(e) => setPhone(e.target.value)}
                className="upload"
                placeholder="Phone Number"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="upload"
                placeholder="Password"
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="upload"
                placeholder="Confirm Password"
                required
              />
              <button className="upload" type="submit">
                Signup 🔓
              </button>
            </form>
          </div>
          <div className="pinkball">
            <img src={pinkball} alt="" />
          </div>
          <div className="molecule">
            <img src={molecule} alt="" />
          </div>
          <div className="gridbox">
            <img src={gridbox} alt="" />
          </div>
          <div className="brain">
            <img src={brain} alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
