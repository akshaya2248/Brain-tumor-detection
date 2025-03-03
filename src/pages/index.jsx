import React, { useEffect, useState } from "react";
import "../home.css";
import brain from "../assets/brain.png";
import gridbox from "../assets/gridbox.png";
import molecule from "../assets/molecule.png";
import pinkball from "../assets/pinkball.png";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context";

const Home = () => {
  const { userLoggedIn } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [classtype, setClasstype] = useState(null);
  const [desc, setDesc] = useState(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // Clean up
    }
  }, [file]);

  const handleReload = () => {
    window.location.reload();
  };

  const handlePredict = () => {
    setPredicting(true);
    // Add any simple prediction simulation if needed
    setPredicting(false);
  };

  return (
    <div className="parent">
      {!userLoggedIn && <Navigate to={"/login"} replace={true} />}
      <div className="child">
        <div className="left">
          {classtype && <h3>{classtype}</h3>}
          <br />
          {desc && <h4 className="bolddesc">{desc}</h4>}
          {!classtype && <h3>BRAIN TUMOR DETECTION</h3>}
          <br />
          {!preview && (
            <h4>
              I am a Deep learning model. I can classify brain tumors up to 4
              types. Try me out!
            </h4>
          )}
          <br />
          {!preview && <button className="upload">pick an image 👉</button>}
          {preview && !desc && !predicting && (
            <button className="upload" onClick={handlePredict}>
              Predict
            </button>
          )}
          {preview && !desc && predicting && (
            <button className="upload" disabled>
              Predicting...⌛
            </button>
          )}
          {classtype && (
            <button className="upload" onClick={handleReload}>
              Check another
            </button>
          )}
        </div>
        <div className="right">
          <form>
            <div className="container">
              {preview && <img src={preview} alt="Preview" />}
              {!preview && (
                <label htmlFor="fileInput" id="dropArea">
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    hidden
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <div id="img-view">
                    <p>pick an image</p>
                  </div>
                </label>
              )}
            </div>
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
  );
};

export default Home;
