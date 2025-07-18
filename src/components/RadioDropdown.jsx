import React, { useEffect, useState } from 'react';
const SESSION_KEY=9693

const RadioDropdown = () => {
    const [messages, setMessages] = useState(null);
    const [driverData, setDriverData] = useState([]);
    const [loading, setLoading] = useState(true); // Combined loading state

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch(
                    `https://api.openf1.org/v1/team_radio?session_key=${SESSION_KEY}`
                );
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                const data = await res.json();
                setMessages(data); // Limit for demo
            } catch (error) {
                console.error('Error fetching messages:', error);
                // Handle the error appropriately, possibly set an error state
            }
        };

        const fetchDrivers = async () => {
            try {
                const res = await fetch('https://api.openf1.org/v1/drivers');
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                const data = await res.json();
                setDriverData(data);
            } catch (error) {
                console.error('Error fetching drivers:', error);
                // Handle the error appropriately
            } finally {
                setLoading(false); // Set loading to false after both fetches
            }
        };

        fetchMessages();
        fetchDrivers();
    }, []); // Empty dependency array: run once on mount

    const getDriver = (number, session) => {
        return driverData.find(
            (entry) => entry.driver_number === number && entry.session_key === session
        );
    };

    if (loading) {
        return <p>Loading...</p>; // Show loading message while both are fetching
    }

    return (
        <>
        <div className='dropdown-bar'>
            <span className='center floatl radio-lap'>LAP</span>
            <span className='center floatl' style={{ width:'25vw'}}>DRIVER</span>
            <span className='center floatl' style={{ width:'25vw', marginLeft: '60px' }}>TEAM</span>
        </div>
        {messages && messages.length > 0 ? ( // Check if messages is not null and has data
            messages.map((item, index) => {
                const driver = getDriver(item['driver_number'], SESSION_KEY); // Get driver once per iteration
                return (
                    <>
                    <div className='dropdown-container' key={index}>
                        <div className='dropdown-bar'>
                            <span className='radio-lap floatl center'>21</span>
                            <img src={driver.headshot_url} alt={driver.name_acronym}></img>
                            <span className='driver-name'>
                                {driver.full_name}
                            </span>
                            <img src={ './src/assets/logos/' + driver.team_name + '.webp' }
                                alt={driver.team_name.slice(0,3)}></img>
                            <span className='team-name' style={{ color: '#' + driver.team_colour }}>
                                {driver.team_name}
                            </span>
                            <span className='dropdown-arrow floatr center'>v</span>
                        </div>
                        <div className='dropdown-section'>
                            
                        </div>
                    </div>
                    </>
                );
            })
        ) : (
            <p>No messages available.</p>
        )}
    </>
    );
};
export default RadioDropdown