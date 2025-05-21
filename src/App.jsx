import './App.css'
import BuildingScene from './components/Building'
import RoomScene from './components/Room'
import Navbar from './components/Navbar'
import MainScene from './components/MainScene'

function App() {
  return (
    <div className="App">
      {/* <Navbar /> */}
      {/* <BuildingScene /> */}
      <div className="canvas">
        {/* <RoomScene /> */}
        <MainScene />
      </div> 
    </div>
  )
}

export default App
