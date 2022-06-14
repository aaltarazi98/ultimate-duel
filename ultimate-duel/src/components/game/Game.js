import React, {useEffect} from 'react'
import Console from "./components/Console"
import Player from "./components/Player"
import Opponent from "./components/Opponent"


export default function Game(props) {
    const vol = parseInt( props.sfxVol )/100

    return (
        <div className="game">
            <Opponent player = {props.player} opponent ={props.opponent} vol = {vol}/>
            <Player player = {props.player} opponent ={props.opponent} vol = {vol}/>
            <Console player = {props.player} opponent={props.opponent}/>
        </div>

    )
}
