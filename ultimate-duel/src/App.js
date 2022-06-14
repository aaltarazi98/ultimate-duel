import Main from "./components/Main"
import Lobby from "./components/game/Lobby"
import socket from "./socketConfig"
import {useState} from 'react'
import Sound from "react-sound"
import battletheme from "./assets/soundFx/battletheme2.mp3"
import wintheme from "./assets/soundFx/wintheme.mp3"
import losstheme from "./assets/soundFx/losstheme.mp3"

function App() {
  const [gameRoom, setGameRoom] = useState('')
  const [started, setStarted] = useState(false)
  const [name, setName] = useState('')
  const [playMusic, setPlayMusic] = useState(false)
  const [music, setMusic] = useState(battletheme)
  const [musicVol, setMusicVol] = useState(localStorage.getItem('musicVol') || 20)
  const [sfxVol, setSfxVol] = useState(localStorage.getItem('sfxVol') || 20)

  socket.on('joined',(playerName, playerRoom) =>{
    setGameRoom(playerRoom)
    setName(playerName)
    setStarted(true)
  })

  socket.on('left', ()=>{
    setStarted(false)
    setPlayMusic(false)
  })

  socket.on('rematch',()=>{
    setPlayMusic(false)
  })

  socket.on('startGame', ()=>{
    setMusic(battletheme)
    setPlayMusic(true)
  })

  socket.on('win', ()=>{
    setMusic(wintheme)
  })

  socket.on('loss', ()=>{
    setMusic(losstheme)
  })
  return (
    <div>
      {playMusic && <Sound
          url = {music}
          playStatus = {Sound.status.PLAYING}
          autoLoad = {true}
          playFromPosition = {300}
          loop = {true}
          volume = {parseInt(musicVol)}
        />}

      {started ?
      
        <Lobby name={name} room={gameRoom} sfxVol ={sfxVol}/> 
        : 
        <Main musicVol = {musicVol} sfxVol = {sfxVol} setMusicVol={setMusicVol} setSfxVol={setSfxVol}/>}
    </div>
  );
}

export default App;
