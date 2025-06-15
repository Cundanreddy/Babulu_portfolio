import './App.css'
import Navbar from './components/Navbar'
import MainScene from './components/MainScene'
import { useState } from 'react'

function App() {
  const [activeView, setActiveView] = useState('front')

  return (
    <div className="App">
      <Navbar setActiveView={setActiveView} />
      <div className="canvas">
        <MainScene activeView={activeView} />
      </div> 
    </div>
  )
}

export default App
