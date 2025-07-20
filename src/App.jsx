import React, { useState } from 'react';
import Header from './components/Header'
import RaceHeader from './components/RaceHeader'
import RadioDropdown from './components/RadioDropdown'

function App() {

  const [sessionKey, setSessionKey] = useState(9693); // most recent session key

  return (
    <>
      <Header sessionKey={sessionKey} setSessionKey={setSessionKey}/>
      <RaceHeader sessionKey={sessionKey}/>
      <RadioDropdown sessionKey={sessionKey}/>
    </>
  )
}

export default App