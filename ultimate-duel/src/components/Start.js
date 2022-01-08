import React, {useState} from 'react'
import { Link, Switch, Route } from 'react-router-dom'
import socket from '../socketConfig'

export default function Start(props) {
    const [name, setName] = useState("")
    const [room, setRoom] = useState("")
    const [isFull, setFull] = useState(false)
    const [isValid, setValid] = useState(true)

    socket.on('roomFull', ()=>{
        setRoom('')
        setFull(true)
    })

    function handleName (event){
        setName(event.target.value)
    }
    function handleRoom (event){
        setRoom(event.target.value)
    }

    function handleJoin (event){
        if (!name || !room){
            setValid(false)
            setTimeout (()=>{setValid(true)},5000)
            return
        }
        socket.emit('joinRoom',name, room)
    }

    return (
        <div>
            <p>Enter name and the code for the room to host/join</p>
            <p style={{color: "#d30cb8", fontSize:"2vh"}}>{isValid? null:"Please enter all required fields!"}</p>
            <p>Player Name:</p>
            <p>{null}</p>
            <input type ="text" value={name} autocomplete="off" onChange={handleName} maxLength={15}/>
            <p>Room Code:</p>
            <p style={{color: "#d30cb8", fontSize:"16px"}}>{isFull?"Room is full, please try another code!":null}</p>
            <input required name="code" type ="text" value = {room} autocomplete="off" onChange={handleRoom} onKeyPress={e=> e.key === "Enter" && handleJoin} maxLength={10}/><br/><br/>
            <button className ="goButton" onClick={handleJoin}>Go!</button>
            <br/>
            <Link to="/" style={{fontSize: "8vh"}}>&larr;</Link>
        </div>
    )
}
