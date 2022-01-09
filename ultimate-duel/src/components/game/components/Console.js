import React, {useState, useEffect} from 'react'
import socket from '../../../socketConfig'
import Countdown, {zeroPad} from 'react-countdown'


const actions = ["fired", "charged", "shielded", "blasted" ]
const blastCharge = 7



export default function Console(props) {

    const [consoleMsg, setConsoleMsg] = useState('')
    const [render, setRender] = useState(true)
    const [isOver, setOver] = useState(false)
    const [isClicked, setClicked] = useState(false)

    socket.on('draw', ()=>{
        setOver(true)
        setConsoleMsg("Draw!")
    })
    socket.on('loss', ()=>{
        setOver(true)
        setConsoleMsg("You lose...")
    })
    socket.on('win', ()=>{
        setOver(true)
        setConsoleMsg("You win!")
    })
    socket.on('enemyLeft', ()=>{
        setOver(true)
        setConsoleMsg("Opponent disconnected...")
    })

    useEffect(()=>{

        if (render) {
            setConsoleMsg("You entered battle against " + props.opponent.name +"!")
            setRender(false)
            setTimeout(()=>setConsoleMsg(null) , 3500)
        }else if (props.player.action !== '') {
            setConsoleMsg("You " + actions[props.player.action] + ". Your opponent " + actions[props.opponent.action] + "!");
            setClicked(false)
            const clear = setTimeout(()=>setConsoleMsg(null) , 3500)
            if (props.opponent.hp === 0 || props.player.hp === 0 || isOver) clearTimeout(clear)
        }        

    },[props.opponent, isOver])

    function handleClick(e){
        socket.emit('action', props.player, e.target.value)
        setClicked(true)
    }

    function handleRematch(){
        socket.emit('rematch', props.player.room)
        socket.emit('joinRoom', props.player.name, props.player.room)
    }

    const renderer = ({hours, minutes, seconds, milliseconds}) =>{
        return <span>{seconds}.{zeroPad(milliseconds, 3)}</span>
    }
    return (
        <div className="console">
            {consoleMsg?

            <p className="static">{consoleMsg}</p>
            
            :
            <>

                <div style={{float: 'right', fontSize:'1em'}}>
                    <br/>
                    { isClicked ? <></> : <Countdown date={Date.now() + 6000} renderer= {renderer} precision={1} intervalDelay={100} zeroPadTime={1} onComplete={()=>{if(!isClicked)socket.emit('action', props.player, 2)}}/>}
                </div>
                <div>
                    <p className="static">What is your next move?</p>
                    <ul>
                        {props.player.charge > 0 && !isClicked ?<li value='0' className = 'selection' onClick={handleClick}>Fire</li>:<li className = 'unavailable'>Fire</li>}<br/>
                        {props.player.charge < blastCharge && !isClicked ?<li value ='1' className= 'selection' onClick={handleClick}>Charge</li>:<li className = 'unavailable'>Charge</li>}<br/>
                        {!isClicked ? <li value = '2' className = 'selection' onClick={handleClick}>Shield</li>:<li className = 'unavailable'>Shield</li>}<br/>
                        {props.player.charge === blastCharge && !isClicked ? <li value ='3'className = 'selection' onClick={handleClick}>Blast</li>:<li className = 'unavailable'>Blast</li>}<br/>
                    </ul>
                </div>

            </>
            }

            {isOver?
            <ul>
                <li className = 'selection' onClick={handleRematch} >Rematch!</li><br/>
                <li className = 'selection' onClick={()=>socket.emit('leaveRoom')} >Leave...</li><br/>
            </ul>
            :
            null }
        </div>
    )
}
