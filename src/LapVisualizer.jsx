import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import RaceHeader from './components/RaceHeader'
import getMeeting from './data/getMeeting';
import races from './data/races.js'


function LapVisualizer({ sessionKey, setSessionKey }) {

  const [messages, setMessages] = useState(null);
	const [drivers, setDrivers] = useState([]);
  const [session, setSession] = useState(null);
  const [meeting, setMeeting] = useState(null);
  const [lap, setLap] = useState('');
  const [maxLap, setMaxLap] = useState('N/A')

  let [thing, setThing] = useState(0);

  const handleInputChange = (event) => {
    setLap(event.target.value)
  }

  const handleSubmit = ( event ) => {
    event.preventDefault();
    setThing(lap);
  }

  useEffect(() => {
    document.title = 'F1 Lap Visualizer';

    const fetchData = async () => {

      const [messagesRes, driversRes] = await Promise.all([
        fetch(`https://api.openf1.org/v1/team_radio?session_key=${sessionKey}`),
        fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`)
      ]);

      const [messagesData, driversData] = await Promise.all([
        messagesRes.json(),
        driversRes.json()
      ])

      setMessages(messagesData)
      setDrivers(driversData)
    }

    const fetchMeetings = async (key) => {
      const meeting = await getMeeting(sessionKey)
      setMeeting(meeting);
      console.log(meeting)
      const racesInYear = races[meeting?.year];
      const laps = racesInYear.find(gp => gp.location === meeting?.location)?.num_laps;
      console.log(racesInYear)
      setMaxLap(laps)
    };

    if (sessionKey) {
      fetchData()
      fetchMeetings(sessionKey)
    }

  }, [sessionKey])
  
  return (
    <>
      <Header sessionKey={sessionKey} setSessionKey={setSessionKey} />
      <RaceHeader sessionKey={sessionKey}/>
      <form>
        <input type="number" value={lap} onChange={handleInputChange} placeholder={maxLap}></input>
        <div onClick={(event) => {handleSubmit(event)}}>Submit</div>
      </form>
    </>
  )
}

export default LapVisualizer
