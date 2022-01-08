import React from 'react'
import { Link, Switch, Route } from 'react-router-dom'

export default function Settings(props) {

    return (
        <div>
            <p>Music Volume:</p>
            <input className ="slider" type="range" min={0} max={40} value = {props.musicVol} onChange={(e)=> {
                const vol = parseInt(e.target.value)
                props.setMusicVol(parseInt(e.target.value))
                localStorage.setItem('musicVol', JSON.stringify(vol))
                }}/>
            <br/>
            <p>SFX Volume:</p>
            <input className='slider' type="range" min={0} max={40} value = {props.sfxVol} onChange={(e)=> {
                const vol = parseInt(e.target.value)
                props.setSfxVol(vol)
                localStorage.setItem('sfxVol', JSON.stringify(vol))
                }}/>
            <br/><br/>
            <Link to="/" style={{fontSize: "8vh"}}>&larr;</Link>
        </div>
    )
}
