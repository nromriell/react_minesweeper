import React from 'react'
import './GameOver.css'

const GameOver = (props) => {
    return <div style={{"color":props.color}} className="GameOver">{props.value}</div>;
};

export default GameOver;