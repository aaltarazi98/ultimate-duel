import React from 'react'
import { useState } from 'react'
import socket from '../../socketConfig'
import Game from './Game'


export default function Lobby(props) {
    const [ready, setReady] = useState(false)
    const [opponent, setOpponent] = useState({})
    const [player, setPlayer] = useState({})

    socket.on('startGame', (player1, player2)=>{
        setPlayer(player1)
        setOpponent(player2)
        setReady(true)
    })

    socket.on('roundFinish', (player1, player2)=>{
        setPlayer(player1)
        setOpponent(player2)
    })

    socket.on('rematch', ()=>{
        setReady(false)
    })


    return (
        <>
        {ready?

            <Game player = {player} opponent = {opponent}  sfxVol = {props.sfxVol}/>

            :

            <div className ='waiting'>
                <p>Waiting for opponent...</p>
                <p>You are in room {props.room}</p>
                <button className ="goButton" onClick={()=>socket.emit('leaveRoom')}>Back</button>
            </div>}
        </>
        )
}
