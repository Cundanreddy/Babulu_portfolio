import './App.css'
import BuildingScene from './components/Building'
import RoomScene from './components/Room'
import Navbar from './components/Navbar'
import MainScene from './components/MainScene'
import { useState } from 'react'

function App() {
  const [activeView, setActiveView] = useState('front');
  const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(false);

  return (
    <div className="App">
      <Navbar 
        setActiveView={setActiveView} 
        orbitControlsEnabled={orbitControlsEnabled}
        setOrbitControlsEnabled={setOrbitControlsEnabled}
      />
      {/* <BuildingScene /> */}
      <div className="canvas">
        {/* <RoomScene /> */}
        <MainScene 
          activeView={activeView} 
          orbitControlsEnabled={orbitControlsEnabled}
        />
      </div> 
    </div>
  )
}

export default App
