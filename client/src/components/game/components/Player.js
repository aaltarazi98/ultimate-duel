import React, {useState, useEffect} from 'react'
import still from '../../../assets/player.png'
import shield from '../../../assets/playerShield.png'
import hurt from '../../../assets/playerHurt.png'
import heart from '../../../assets/heart.png'
import emptyHeart from '../../../assets/emptyHeart.png'
import useSound from "use-sound"
import fireFx from "../../../assets/soundFx/laser.mp3"
import blastFx from "../../../assets/soundFx/blast.mp3"
import deathFx from "../../../assets/soundFx/death.mp3"
import chargeFx from "../../../assets/soundFx/charge.mp3"
import shieldFx from "../../../assets/soundFx/shield.mp3"
import damageFx from "../../../assets/soundFx/damage.mp3"


export default function Player(props) {
    const vol = props.vol
    const [playFire] = useSound(fireFx, {volume: vol})
    const [playBlast] = useSound(blastFx, {volume: vol})
    const [playCharge] = useSound(chargeFx, {volume: vol})
    const [playShield] = useSound(shieldFx, {volume: vol})
    const [playDamage] = useSound(damageFx, {volume: vol})
    const [playDeath] = useSound(deathFx, {volume: vol})
    const [hp, setHp] = useState(3)
    const [chargeColor, setChargeColor] = useState("#CECBBC")
    const [sprite, setSprite] = useState(still)
    
    function showHeart(num){
        if (num === 3){
            return(
                <div style={{textAlign: 'right', margin: '0', padding: '0', marginTop: '0.5em'}}>
                    <img style={{height: '2em', margin: '0'}} src={heart}></img>
                    <img style={{height: '2em', margin: '0'}}src={heart}></img>
                    <img style={{height: '2em', margin: '0'}}src={heart}></img>
                </div>
            )
        }else if (num === 2){
            return(
                <div style={{textAlign: 'right', margin: '0', padding: '0', marginTop: '0.5em'}}>
                    <img style={{height: '2em', margin: '0'}}src={heart}></img>
                    <img style={{height: '2em', margin: '0'}}src={heart}></img>
                    <img style={{height: '2em', margin: '0'}}src={emptyHeart}></img>
                </div>
            )
        }else if (num === 1){
            return(
                <div style={{textAlign: 'right', margin: '0', padding: '0', marginTop: '0.5em'}}>
                    <img style={{height: '2em', margin: '0'}}src={heart}></img>
                    <img style={{height: '2em', margin: '0'}}src={emptyHeart}></img>
                    <img style={{height: '2em', margin: '0'}}src={emptyHeart}></img>
                </div>
            )
        }else{
            return(
                <div style={{textAlign: 'right', margin: '0', padding: '0', marginTop: '0.5em'}}>
                    <img style={{height: '2em', margin: '0'}}src={emptyHeart}></img>
                    <img style={{height: '2em', margin: '0'}}src={emptyHeart}></img>
                    <img style={{height: '2em', margin: '0'}}src={emptyHeart}></img>
                </div>
            )
        }
    }


    useEffect(()=>{
        const player = props.player
        const opponent = props.opponent

        if (player.action === 0){
            setChargeColor('#eca089')
            playFire()
        }else if (player.action === 1){
            setChargeColor('#5da4a6')
            playCharge()
        }else if (player.action === 2){
            setSprite(shield)
            playShield()
        }else if (player.action === 3){
            playBlast()
        }

        if (opponent.action === 0){
            if (player.action !== 2){
                setTimeout(()=>{
                    setSprite(hurt)
                    playDamage()
                    setHp(player.hp)
                    if (player.health !== 0){
                        setTimeout(()=>{
                            setChargeColor("#CECBBC")
                            setSprite(still)
                        }, 1500)
                    }else{
                        setTimeout(()=>{
                            playDeath()
                            setChargeColor("#CECBBC")
                        }, 500)
                    }
                }, 1000)
            }else{
                setTimeout(()=>{
                    setSprite(still)
                    setChargeColor("#CECBBC")
                }, 2000)
            }
        }else if (opponent.action === 3){
            setTimeout(()=>{
                setSprite(hurt)
                playDamage()
                setHp(player.hp)
                setTimeout(()=>{playDeath()}, 500)
            }, 2500)
        }else{
            setTimeout(()=>{
                setSprite(still)
                setChargeColor("#CECBBC")
            }, 2000)
        }

    }, [props.opponent])

    return (
        <>
            <div className="playerHUD">
                <p style={{ marginBottom: '0'}}>{props.player.name}</p>
                {showHeart(hp)}
                <p style={{textAlign: 'right', color: chargeColor, marginTop: '0.5em'}}>Charge: {props.player.charge}</p>
            </div>
            <div>
            <img src={sprite}  className="playerSprite"></img>
            </div>
        </>
    )
}
