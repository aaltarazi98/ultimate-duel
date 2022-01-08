import React, {useState, useEffect} from 'react'
import still from '../../../assets/opponent.png'
import hurt from '../../../assets/opponentHurt.png'
import charging from '../../../assets/opponentCharge.png'
import shield from '../../../assets/opponentShield.png'
import fire from '../../../assets/opponentFire.png'
import blast from '../../../assets/opponentBlast.png'
import heart from '../../../assets/heart.png'
import emptyHeart from '../../../assets/emptyHeart.png'
import useSound from "use-sound"
import fireFx from "../../../assets/soundFx/laser.mp3"
import blastFx from "../../../assets/soundFx/blast.mp3"
import deathFx from "../../../assets/soundFx/death.mp3"
import chargeFx from "../../../assets/soundFx/charge.mp3"
import shieldFx from "../../../assets/soundFx/shield.mp3"
import damageFx from "../../../assets/soundFx/damage.mp3"


export default function Opponent(props) {
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
                <div style={{textAlign: 'right', margin: '0', padding: '0'}}>
                    <img style={{height: '2em', margin: '0'}} src={heart}></img>
                    <img style={{height: '2em', margin: '0'}}src={heart}></img>
                    <img style={{height: '2em', margin: '0'}}src={heart}></img>
                </div>
            )
        }else if (num === 2){
            return(
                <div style={{textAlign: 'right', margin: '0', padding: '0'}}>
                    <img style={{height: '2em', margin: '0'}}src={heart}></img>
                    <img style={{height: '2em', margin: '0'}}src={heart}></img>
                    <img style={{height: '2em', margin: '0'}}src={emptyHeart}></img>
                </div>
            )
        }else if (num === 1){
            return(
                <div style={{textAlign: 'right', margin: '0', padding: '0'}}>
                    <img style={{height: '2em', margin: '0'}}src={heart}></img>
                    <img style={{height: '2em', margin: '0'}}src={emptyHeart}></img>
                    <img style={{height: '2em', margin: '0'}}src={emptyHeart}></img>
                </div>
            )
        }else{
            return(
                <div style={{textAlign: 'right', margin: '0', padding: '0'}}>
                    <img style={{height: '2em', margin: '0'}}src={emptyHeart}></img>
                    <img style={{height: '2em', margin: '0'}}src={emptyHeart}></img>
                    <img style={{height: '2em', margin: '0'}}src={emptyHeart}></img>
                </div>
            )
        }
    }

    useEffect(()=>{
        const opponent = props.opponent
        const player = props.player

        if (opponent.action === 0){
            setChargeColor('#eca089')
            setSprite(fire)
            playFire()
        }else if (opponent.action === 1){
            setChargeColor('#5da4a6')
            setSprite(charging)
            playCharge()
        }else if (opponent.action === 2){
            setSprite(shield)
            playShield()
        }else if (opponent.action === 3){
            setSprite(blast)
            playBlast()
        }

        if (player.action === 0){
            if (opponent.action !== 2){
                setTimeout(()=>{
                    setSprite(hurt)
                    playDamage()
                    setHp(opponent.hp)
                    if (opponent.health !== 0){
                        setTimeout(()=>{
                            setChargeColor("#CECBBC")
                            setSprite(still)
                        }, 1500)
                    }else{
                        setTimeout(()=>{playDeath()}, 500)
                    }
                }, 1000)
            }else{
                setTimeout(()=>{
                    setSprite(still)
                    setChargeColor("#CECBBC")
                }, 2000)
            }
        }else if (player.action === 3){
            setTimeout(()=>{
                setSprite(hurt)
                playDamage()
                setHp(opponent.hp)
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
            <div className="opponentHUD">
                <p style={{ marginBottom: '0'}}>{props.opponent.name}</p>
                {showHeart(hp)}
                <p className ="static" style={{textAlign: 'right', color: chargeColor}}>Charge: {props.opponent.charge}</p>
            </div>
            <div>
                <img src={sprite}  className="opponentSprite"></img>
            </div>
        </>
    )
}

