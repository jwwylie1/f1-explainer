import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage'; // Home Page component
import RadioExplainer from './RadioExplainer'; // Radio Explainer component
import LapVisualizer from './LapVisualizer'; // Track Visualizer component
import getMeeting from './data/getMeeting';


function App() {

    const [sessionKey, setSessionKey] = useState(9928); // most recent session key
    const [meetingData, setMeetingData] = useState(null);
    const [driversList, setDriversList] = useState([]);

    useEffect(() => {
        if (!sessionKey) return;

        const fetchData = async () => {
            try {
                console.log("App fetching data...");

                // Fetch Meeting
                const mData = await getMeeting(sessionKey);
                setMeetingData(mData);

                // 2. Fetch Drivers (Restored Logic)
                const driversRes = await fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`);
                if (!driversRes.ok) throw new Error("Failed to fetch drivers");
                const driversData = await driversRes.json();

                // Filter out duplicates or special entries if needed, or just set it
                setDriversList(driversData);

            } catch (error) {
                console.error("Error loading data:", error);
            }
        }
        fetchData();
    }, [sessionKey]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage sessionKey={sessionKey} setSessionKey={setSessionKey} />} />
                <Route path="/radio-explainer" element={<RadioExplainer sessionKey={sessionKey} setSessionKey={setSessionKey} />} />
                <Route path="/lap-visualizer"
                    element={
                        <LapVisualizer sessionKey={sessionKey} setSessionKey={setSessionKey} meeting={meetingData} driversList={driversList} />} />
            </Routes>
        </Router>
    )
}

export default App