import React, { useState, useEffect } from 'react';
import { collection, getDoc, getDocs, doc } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useAuth } from '../context';
import { Navigate } from 'react-router-dom';
import moment from 'moment';

const HistoryPage = () => {
    const [uploads, setUploads] = useState([]);
    const { userLoggedIn } = useAuth()
    const { currentUser } = useAuth()
    useEffect(() => {
        const fetchData = async () => {

            try {

                const userDocRef = doc(db, 'users', currentUser.email);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    const userUploads = userDocSnapshot.data().uploads || [];
                    setUploads(userUploads.reverse());
                } else {
                    console.log('User document does not exist');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='uploadimages'>
            {!userLoggedIn && (<Navigate to={'/login'} replace={true} />)}

            <h1>Your Uploads</h1>
            <ul className='historyul'>
                {uploads.map((upload, index) => (
                    <li className='historyli' key={index}>
                        <img src={upload.imageURL} alt="Uploaded Image" />
                        <h2>
                            {upload.result}
                        </h2>

                        <br />
                        Patient Name: {upload.patientName}
                        <br />
                        <br />
                        Patient Age: {upload.patientAge}
                        <br />
                        <br />
                        Blood Group: {upload.blood}
                        <br />
                        <br />
                        Time of prediction: {upload.timestamp && moment(upload.timestamp.toDate()).format('dddd DD MMMM YYYY hh:mm A')}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HistoryPage;
