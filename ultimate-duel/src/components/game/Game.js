import React, {useEffect} from 'react'
import Console from "./components/Console"
import Player from "./components/Player"
import Opponent from "./components/Opponent"


export default function Game(props) {
    const vol = parseInt( props.sfxVol )/100

    // function soundFx(action){
    //     if(action === 0) playFire()
    //     else if(action === 1) playCharge()
    //     else if (action === 2) playShield()
    //     else if (action === 3) playBlast()
    //     return
    // }
    useEffect(()=>{
        // soundFx(props.player.action)
        // soundFx(props.opponent.action)

        // const players = [props.player, props.opponent]

        // for (let i = 0 , j ; i < 2 ; i++){
        //     (i === 0) ? j = 1 : j = 0
        //     if (players[i].action === 0 && players[j].action !== 2){
        //         setTimeout(()=>{playDamage()}, 1000)
        //         if (players[j].hp === 0 ) setTimeout(()=>{playDeath()}, 2000)
        //     }else if(players[i].action === 3){
        //         setTimeout(()=>{playDamage()}, 2250)
        //         if (players[j].hp === 0 ) setTimeout(()=>{playDeath()}, 3250)
        //     }
        // }

    },[props.opponent])


    return (
        <div className="game">
            <Opponent player = {props.player} opponent ={props.opponent} vol = {vol}/>
            <Player player = {props.player} opponent ={props.opponent} vol = {vol}/>
            <Console player = {props.player} opponent={props.opponent}/>
        </div>

    )
}
