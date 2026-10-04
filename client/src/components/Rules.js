import React from 'react'
import { Link, Switch, Route } from 'react-router-dom'

export default function Rules() {
    return (
        <div className="rules">
            <div>
                <h3>Welcome to the Ultimate Duel! Please read rules below:</h3>
                <p style={{textAlign:"left"}}>Each player starts with 3 hp and 1 charge. The player who reaches 0 hp loses.There are four actions that can be taken in game:</p>
                <ul style={{textAlign:"left"}}>
                    <li>Fire: shoot a laser at your opponent. Drops opponent health by 1 and requires 1 charge.</li>
                    <li>Charge: charge up your weapon, increasing its current capacity</li>
                    <li>Shield: shield yourself from the opponent's fire!</li>
                    <li>Blast: charge up a powerful beam to that drops the opponent's health to 0 instantly; this cannot be blocked by shield. Requires 7 charges.</li>
                </ul>
                <p style={{textAlign:"left"}}>Each player has 6 seconds to make their move. If they fail to do so, their character will shield!</p>
            </div>
            <div><Link to="/" style={{fontSize: "8vh", textAlign:"center"}}>&larr;</Link></div>
        </div>
    )
}
