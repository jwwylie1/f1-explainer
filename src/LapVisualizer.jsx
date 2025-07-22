import React, { useEffect, useState, useRef } from 'react'
import Header from './components/Header'
import RaceHeader from './components/RaceHeader'
import Canvas from './components/Canvas'
import DriverList from './components/DriverList'
import getMeeting from './data/getMeeting';
import races from './data/races.js'


function LapVisualizer({ sessionKey, setSessionKey }) {

  const [driversList, setDriversList] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [session, setSession] = useState(null);
  const [meeting, setMeeting] = useState(null);
  const [race, setRace] = useState(null)
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

      const driversRes = await fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`);
      const driversData = await driversRes.json()
      setDriversList(driversData)
    }

    const fetchMeetings = async (key) => {
      const meeting = await getMeeting(sessionKey)
      setMeeting(meeting);
      const racesInYear = races[meeting?.year];
      const race = racesInYear.find(gp => gp.location === meeting?.location)
      const laps = race?.num_laps;
      setRace(race)
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
      {/*<form>
        {console.log(driversList)}
        <input type="number" value={lap} onChange={handleInputChange} placeholder={maxLap}></input>
        <DriverList drivers={driversList} />
        <div onClick={(event) => {handleSubmit(event)}}>Submit</div>
      </form>*/}

      <Canvas race={race}/>

    </>
  )
}

export default LapVisualizer
