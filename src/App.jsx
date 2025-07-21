import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RadioExplainer from './RadioExplainer'; // Your Radio Explainer component
import LapVisualizer from './LapVisualizer'; // Your Track Visualizer component

function App() {

  const [sessionKey, setSessionKey] = useState(9947); // most recent session key

  return (
    <Router>
      <Routes>
        <Route path="/radio-explainer" element={<RadioExplainer sessionKey={sessionKey} setSessionKey={setSessionKey} />} />
        <Route path="/lap-visualizer" element={<LapVisualizer sessionKey={sessionKey} setSessionKey={setSessionKey} />} />
      </Routes>
    </Router>
  )
}

export default App