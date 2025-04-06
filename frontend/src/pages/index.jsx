import React, { useEffect, useState } from 'react'
import '../home.css';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context';
import { setDoc, doc, serverTimestamp, arrayUnion, Timestamp } from 'firebase/firestore';
import { db, storage } from "../firebase/firebase";
import { v4 as uuid } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const Home = () => {
    const { userLoggedIn } = useAuth()
    const { currentUser } = useAuth()
    const [file, setFile] = useState();
    const [preview, setPreview] = useState();
    const [classtype, setClasstype] = useState();
    const [cfscore, setCfscore] = useState();
    const [imageurl, setImageurl] = useState(null);
    const [percentage, setPercentage] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [desc, setDesc] = useState();
    const uploadFile = () => {
        setIsPredicting(true)
        const img_unique_id = uuid();
        const storageRef = ref(storage, img_unique_id);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                setPercentage(progress);
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                }
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageurl(downloadURL);
                    console.log('completed')
                    console.log(downloadURL)
                    console.log('completed')
                    handleUpload(downloadURL);
                });
            }
        );
    };
    const handleUpload = async (downloadURL) => {
        if (file) {
            const imageData = new FormData();
            imageData.append('image', file);
            const response = await fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                body: imageData,
            });
            const data = await response.json();
            setClasstype(data.data['class']);
            setCfscore(data.data['cfscore'])
            console.log(data.data['class']);
            setDesc(data.data['descrip']);
            setIsPredicting(false)

            const userDocRef = doc(db, "users", currentUser.email);
            console.log(imageurl)
            console.log(data.data['class'])
            await setDoc(userDocRef, {
                uploads: arrayUnion({
                    imageURL: downloadURL,
                    result: data.data['class'],
                    timestamp: Timestamp.now(),
                }),
            }, { merge: true });
            console.log('Upload details stored in Firestore');
        }
    };
    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    }, [file]);
    const handleReload = () => {
        window.location.reload();
    };
    const pointerWidth = 20; 
    const pointerHeight = 10; 
    const pointerLineWidth = 2; 
    const pointerPercent = cfscore-0.02; 
    const heatmapWidth = 500; 
    const heatmapHeight = 40; 
    const pointerXBase = pointerWidth / 2 + pointerPercent * heatmapWidth;
    const polygon = `
  ${pointerXBase - pointerWidth / 2},${heatmapHeight + pointerHeight} 
  ${pointerXBase + pointerWidth / 2},${heatmapHeight + pointerHeight}
  ${pointerXBase + pointerLineWidth},${heatmapHeight} 
  ${pointerXBase + pointerLineWidth},0 
  ${pointerXBase - pointerLineWidth},0 
  ${pointerXBase - pointerLineWidth},${heatmapHeight}
`;
    const barWidth = pointerWidth + pointerLineWidth * 2;  
    const barHeight = 10;  
    const barYPosition = heatmapHeight - barHeight;  
    return (
        <div class="parent">
            {!userLoggedIn && (<Navigate to={'/login'} replace={true} />)}
            <div class="child">
                <div class="left">
                    {classtype && <h3> This is <strong>{classtype=="others"?'Not an MRI':classtype}</strong></h3>}
                    <br />
                    {desc && <h4 className='bolddesc'>{desc}</h4>}
                    {!classtype && <h3><strong>BRAIN TUMOR DETECTION</strong></h3>}
                    <br />
                    {!preview &&                     <h4 className='desc'>I am a Deep learning model. I can classify brain tumors upto 4 types. Try me out!</h4>

                    }
                    <br />
                    <br />
                    {!preview && <button class="upload">
                        pick an image 👉
                    </button>
                    }
                    {!isPredicting && !classtype && <> {preview && <button class="upload" onClick={uploadFile}>
                        Predict
                    </button>}</>}
                    {isPredicting && !classtype && <> {preview && <button class="upload">
                   Predicting⏳ Please wait...
                    </button>}</>}
                    
                    {classtype && <button class="upload" onClick={handleReload}>
                        Check another
                    </button>}
                </div>
                <div class="right">
                    <form action="/submit" method="POST" enctype="multipart/form-data">
                        <div class="container">
                            {preview && <img src={preview} alt="Preview" />}
                            {!preview && <label for="fileInput" id="dropArea">
                                <input type="file" id="fileInput" accept="image/*" hidden name="image" onChange={(e) => {
                                    setFile(e.target.files[0])
                                }} />
                                <div id="img-view">
                                    <p>pick an image</p>
                                </div>
                            </label>
                            }
                        </div>
                    </form>
                </div>
            </div>
            <div class="content">
                <div class="card">
                    <svg width={heatmapWidth} height={heatmapHeight + pointerHeight}>
                        <defs>
                            <linearGradient id="gradient">
                                <stop offset="5%" stopColor="red" />
                                <stop offset="50%" stopColor="orange" />
                                <stop offset="95%" stopColor="lime" />
                            </linearGradient>
                        </defs>
                        <rect
                            x="10"
                            y="10"
                            width="500"
                            height="30"
                            fill="url(#gradient)"
                        />
                        <polygon points={polygon} fill="black" />
                    </svg>
                    {classtype && <p>Probability: {cfscore.toFixed(2)*100}%</p> }
                </div>
                <div class="card">
                    {classtype && <p>{desc}</p>
                    }
                    {!classtype && <p>Make a prediction to get details.</p>
                    }
                </div>
            </div>
        </div>
    )
}
export default Home