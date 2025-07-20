import React, { useEffect, useState } from 'react';

function RaceHeader({ sessionKey }) {
  const [session, setSession] = useState(null);
  const [meeting, setMeeting] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
        try {
            const res = await fetch(
                `https://api.openf1.org/v1/sessions?session_key=${sessionKey}`
            );
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const data = await res.json();
            setSession(data); // Limit for demo
            fetchMeeting(data[0].meeting_key)
        } catch (error) {
            console.error('Error fetching messages:', error);
            // Handle the error appropriately, possibly set an error state
        }
    };

    const fetchMeeting = async (key) => {
      try {
          const res = await fetch(
              `https://api.openf1.org/v1/meetings?meeting_key=${key}`
          );
          if (!res.ok) {
              throw new Error(`HTTP error! Status: ${res.status}`);
          }
          const data = await res.json();
          setMeeting(data[0]); // Limit for demo
      } catch (error) {
          console.error('Error fetching messages:', error);
          // Handle the error appropriately, possibly set an error state
      }
    };

    fetchSession();
  }, [sessionKey]); // Empty dependency array: run once on mount

  return (
    <>
    <div className="race-header w100" style={{ '--bg-image': `url(/src/assets/circuits/${meeting?.location?.replace(' ', '')}.jpg)` }}>
        {meeting?.meeting_official_name}
        
    </div>
    </>
  )
}

export default RaceHeader