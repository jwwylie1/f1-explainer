import React, { useEffect, useState } from 'react';
import getMeeting from '../data/getMeeting';

function RaceHeader({ sessionKey }) {
    const [meeting, setMeeting] = useState(null);

    useEffect(() => {
        if (!sessionKey) return;

        const fetchMeetings = async () => {
            try {
                const meetingData = await getMeeting(sessionKey)
                if (meetingData) {
                    setMeeting(meetingData)
                }
            } catch (error) {
                console.error("Failed to load race header:", error);
            }
        };

        fetchMeetings(sessionKey)

    }, [sessionKey]); // Empty dependency array: run once on mount

    const locationName = meeting?.location?.replace(/\s+/g, '') || 'default';
    const bgStyle = {
        '--bg-image': meeting ? `url(/assets/backgrounds/${locationName}.jpg)` : 'none'
    };

    return (
        <div className="race-header w100" style={bgStyle}>
            {/* ... */}
        </div>
    );
}

export default RaceHeader