import React, { useState, useEffect } from 'react';
import { collection, getDoc, getDocs, doc } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import { useAuth } from '../context';
import { Navigate } from 'react-router-dom';
import moment from 'moment';
import '../home.css'; // Make sure to add these styles to your CSS file

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
                    // Sort by timestamp, newest first
                    const sortedUploads = userUploads.sort((a, b) => 
                        b.timestamp.toDate() - a.timestamp.toDate()
                    );
                    setUploads(sortedUploads);
                } else {
                    console.log('User document does not exist');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [currentUser]);

    return (
        <div className='history-container'>
            {!userLoggedIn && (<Navigate to={'/login'} replace={true} />)}
            
            <div className='history-header'>
                <h1>Your Upload History</h1>
                <p className='history-subtitle'>{uploads.length} {uploads.length === 1 ? 'scan' : 'scans'} total</p>
            </div>

            {uploads.length === 0 ? (
                <div className='history-empty'>
                    <p>No scans yet. Upload your first MRI to see results here.</p>
                </div>
            ) : (
                <div className='history-grid'>
                    {uploads.map((upload, index) => (
                        <div className='history-card' key={index}>
                            <div className='history-image-container'>
                                <img 
                                    src={upload.imageURL} 
                                    alt="Uploaded MRI scan" 
                                    className='history-image'
                                />
                            </div>
                            <div className='history-details'>
                                <h3 className={`history-result ${upload.result.toLowerCase()}`}>
                                    {upload.result === "others" ? 'Not an MRI' : upload.result}
                                </h3>
                                <p className='history-date'>
                                    {upload.timestamp && moment(upload.timestamp.toDate()).format('MMM D, YYYY [at] h:mm A')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;