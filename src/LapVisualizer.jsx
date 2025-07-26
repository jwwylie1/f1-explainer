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
  const [lap, setLap] = useState(25);
  const [maxLap, setMaxLap] = useState('N/A');
  const [showCanvas, setShowCanvas] = useState(false);

  let [thing, setThing] = useState(0);

  const handleLapChange = (event) => {
    document.getElementById('lap-header').innerText = "Selected Lap - " + event.target.value;
    setLap(event.target.value)
  }

  const handleDriversChange = (selected) => {
    let newDrivers = []
    newDrivers[0] = drivers[1];
    newDrivers[1] = selected;
    setDrivers(newDrivers)
  }

  const handleSubmit = () => {
    setShowCanvas(true)
    setThing(lap);
  }

  useEffect(() => {
    document.title = 'F1 Lap Visualizer';

    const fetchData = async () => {

      const driversRes = await fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`);
      const driversData = await driversRes.json()
      /*const driversData = [{
          "broadcast_name": "M VERSTAPPEN",
          "country_code": "NED",
          "driver_number": 1,
          "first_name": "Max",
          "full_name": "Max VERSTAPPEN",
          "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
          "last_name": "Verstappen",
          "meeting_key": 1219,
          "name_acronym": "VER",
          "session_key": 9158,
          "team_colour": "3671C6",
          "team_name": "Red Bull Racing"
      }, 
      {"broadcast_name": "O PIASTRI",
          "country_code": "AUS",
          "driver_number": 1,
          "first_name": "Oscar",
          "full_name": "Oscar PIASTRI",
          "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/1col/image.png",
          "last_name": "Piastri",
          "meeting_key": 1219,
          "name_acronym": "PIA",
          "session_key": 9158,
          "team_colour": "FF8000",
          "team_name": "McLaren"
      },{
        "broadcast_name": "N HULKENBERG",
        "country_code": "GER",
        "driver_number": 1,
        "first_name": "Nico",
        "full_name": "Nico HULKENBERG",
        "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/NICHUL01_Nico_Hulkenberg/nichul01.png.transform/1col/image.png",
        "last_name": "Hulkenberg",
        "meeting_key": 1219,
        "name_acronym": "HUL",
        "session_key": 9158,
        "team_colour": "00FF00",
        "team_name": "Kick Sauber"
    }, 
    {"broadcast_name": "M VERSTAPPEN",
        "country_code": "NED",
        "driver_number": 1,
        "first_name": "Max",
        "full_name": "Max VERSTAPPEN",
        "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
        "last_name": "Verstappen",
        "meeting_key": 1219,
        "name_acronym": "VER",
        "session_key": 9158,
        "team_colour": "3671C6",
        "team_name": "Red Bull Racing"
    },{
      "broadcast_name": "M VERSTAPPEN",
      "country_code": "NED",
      "driver_number": 1,
      "first_name": "Max",
      "full_name": "Max VERSTAPPEN",
      "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
      "last_name": "Verstappen",
      "meeting_key": 1219,
      "name_acronym": "VER",
      "session_key": 9158,
      "team_colour": "3671C6",
      "team_name": "Red Bull Racing"
  }, 
  {"broadcast_name": "M VERSTAPPEN",
      "country_code": "NED",
      "driver_number": 1,
      "first_name": "Max",
      "full_name": "Max VERSTAPPEN",
      "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
      "last_name": "Verstappen",
      "meeting_key": 1219,
      "name_acronym": "VER",
      "session_key": 9158,
      "team_colour": "3671C6",
      "team_name": "Red Bull Racing"
  },{
    "broadcast_name": "M VERSTAPPEN",
    "country_code": "NED",
    "driver_number": 1,
    "first_name": "Max",
    "full_name": "Max VERSTAPPEN",
    "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
    "last_name": "Verstappen",
    "meeting_key": 1219,
    "name_acronym": "VER",
    "session_key": 9158,
    "team_colour": "3671C6",
    "team_name": "Red Bull Racing"
}, 
{"broadcast_name": "M VERSTAPPEN",
    "country_code": "NED",
    "driver_number": 1,
    "first_name": "Max",
    "full_name": "Max VERSTAPPEN",
    "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
    "last_name": "Verstappen",
    "meeting_key": 1219,
    "name_acronym": "VER",
    "session_key": 9158,
    "team_colour": "3671C6",
    "team_name": "Red Bull Racing"
},{
  "broadcast_name": "M VERSTAPPEN",
  "country_code": "NED",
  "driver_number": 1,
  "first_name": "Max",
  "full_name": "Max VERSTAPPEN",
  "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
  "last_name": "Verstappen",
  "meeting_key": 1219,
  "name_acronym": "VER",
  "session_key": 9158,
  "team_colour": "3671C6",
  "team_name": "Red Bull Racing"
}, 
{"broadcast_name": "M VERSTAPPEN",
  "country_code": "NED",
  "driver_number": 1,
  "first_name": "Max",
  "full_name": "Max VERSTAPPEN",
  "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
  "last_name": "Verstappen",
  "meeting_key": 1219,
  "name_acronym": "VER",
  "session_key": 9158,
  "team_colour": "3671C6",
  "team_name": "Red Bull Racing"
},{
  "broadcast_name": "M VERSTAPPEN",
  "country_code": "NED",
  "driver_number": 1,
  "first_name": "Max",
  "full_name": "Max VERSTAPPEN",
  "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
  "last_name": "Verstappen",
  "meeting_key": 1219,
  "name_acronym": "VER",
  "session_key": 9158,
  "team_colour": "3671C6",
  "team_name": "Red Bull Racing"
}, 
{"broadcast_name": "M VERSTAPPEN",
  "country_code": "NED",
  "driver_number": 1,
  "first_name": "Max",
  "full_name": "Max VERSTAPPEN",
  "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
  "last_name": "Verstappen",
  "meeting_key": 1219,
  "name_acronym": "VER",
  "session_key": 9158,
  "team_colour": "3671C6",
  "team_name": "Red Bull Racing"
},{
  "broadcast_name": "M VERSTAPPEN",
  "country_code": "NED",
  "driver_number": 1,
  "first_name": "Max",
  "full_name": "Max VERSTAPPEN",
  "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
  "last_name": "Verstappen",
  "meeting_key": 1219,
  "name_acronym": "VER",
  "session_key": 9158,
  "team_colour": "3671C6",
  "team_name": "Red Bull Racing"
}, 
{"broadcast_name": "M VERSTAPPEN",
  "country_code": "NED",
  "driver_number": 1,
  "first_name": "Max",
  "full_name": "Max VERSTAPPEN",
  "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
  "last_name": "Verstappen",
  "meeting_key": 1219,
  "name_acronym": "VER",
  "session_key": 9158,
  "team_colour": "3671C6",
  "team_name": "Red Bull Racing"
},{
  "broadcast_name": "M VERSTAPPEN",
  "country_code": "NED",
  "driver_number": 1,
  "first_name": "Max",
  "full_name": "Max VERSTAPPEN",
  "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
  "last_name": "Verstappen",
  "meeting_key": 1219,
  "name_acronym": "VER",
  "session_key": 9158,
  "team_colour": "3671C6",
  "team_name": "Red Bull Racing"
}, 
{"broadcast_name": "M VERSTAPPEN",
  "country_code": "NED",
  "driver_number": 1,
  "first_name": "Max",
  "full_name": "Max VERSTAPPEN",
  "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
  "last_name": "Verstappen",
  "meeting_key": 1219,
  "name_acronym": "VER",
  "session_key": 9158,
  "team_colour": "3671C6",
  "team_name": "Red Bull Racing"
},{
  "broadcast_name": "M VERSTAPPEN",
  "country_code": "NED",
  "driver_number": 1,
  "first_name": "Max",
  "full_name": "Max VERSTAPPEN",
  "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
  "last_name": "Verstappen",
  "meeting_key": 1219,
  "name_acronym": "VER",
  "session_key": 9158,
  "team_colour": "3671C6",
  "team_name": "Red Bull Racing"
}, 
{"broadcast_name": "M VERSTAPPEN",
  "country_code": "NED",
  "driver_number": 1,
  "first_name": "Max",
  "full_name": "Max VERSTAPPEN",
  "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
  "last_name": "Verstappen",
  "meeting_key": 1219,
  "name_acronym": "VER",
  "session_key": 9158,
  "team_colour": "3671C6",
  "team_name": "Red Bull Racing"
},{
  "broadcast_name": "M VERSTAPPEN",
  "country_code": "NED",
  "driver_number": 1,
  "first_name": "Max",
  "full_name": "Max VERSTAPPEN",
  "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
  "last_name": "Verstappen",
  "meeting_key": 1219,
  "name_acronym": "VER",
  "session_key": 9158,
  "team_colour": "3671C6",
  "team_name": "Red Bull Racing"
}, 
{"broadcast_name": "M VERSTAPPEN",
  "country_code": "NED",
  "driver_number": 1,
  "first_name": "Max",
  "full_name": "Max VERSTAPPEN",
  "headshot_url": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png",
  "last_name": "Verstappen",
  "meeting_key": 1219,
  "name_acronym": "VER",
  "session_key": 9158,
  "team_colour": "3671C6",
  "team_name": "Red Bull Racing"
},
      ]*/
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
      <Header sessionKey={sessionKey} setSessionKey={setSessionKey} title="Lap Visualization Tool"/>
      <RaceHeader sessionKey={sessionKey}/>
      <form style={{ textAlign: 'center' }} onSubmit={(event) => {event.preventDefault(); handleSubmit()}}>
        <h2 style={{ textDecoration: 'none' }} id="lap-header">Selected Lap - 22</h2>
        {/*<input type="number" value={lap} onChange={handleLapChange} 
        placeholder={maxLap} className="lap-input white f1 center"></input>*/}

        <input type="range" value={lap} onChange={handleLapChange} min='1' max={maxLap} 
        step='1' className="lap-input white f1 center"></input>

        <h2 style={{ textDecoration: 'none' }}>Select 2 Drivers</h2>
        <DriverList drivers={driversList} changeDrivers={handleDriversChange} />
        {/*<DriverList drivers={driversList} updateFunction={handleDriver2Change} />*/}
        <button className="lap-submit">Submit</button>
      </form>

      <div id='warning' className='center'>WARNING</div>

      {showCanvas && <Canvas race={race} driver1={drivers[0]} driver2={drivers[1]} lap={lap} />}

    </>
  )
}

export default LapVisualizer
