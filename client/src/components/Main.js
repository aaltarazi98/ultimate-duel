import { Link, Switch, Route } from 'react-router-dom'
import Start from "./Start"
import Settings from "./Settings"
import Rules from "./Rules"


function Main(props) {

    return (
        <div className = "main">
            <div className="title">
                <h1>The</h1>
                <h1>Ultimate</h1>
                <h1>Duel</h1>
            </div>
            {/* Main Menu */}
            <div className ="selectionsMenu">
                    <Switch>
                        <Route exact path ="/">
                        <div style={{textAlign:"center", lineHeight:"1.5em"}}>
                            <Link to="/Start">Start</Link><br/><br/>
                            <Link to="/Settings">Audio Settings</Link><br/><br/>
                            <Link to="/Info">Rules</Link><br/><br/>
                        </div>
                        </Route>
                        <Route path="/Start"><Start/></Route>
                        <Route path="/Settings"><Settings musicVol = {props.musicVol} sfxVol = {props.sfxVol} setMusicVol={props.setMusicVol} setSfxVol={props.setSfxVol} /></Route>
                        <Route path="/Info"><Rules/></Route>
                    </Switch>
            </div>
        </div>
    )
}

export default Main
