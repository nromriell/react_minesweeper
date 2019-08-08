import React from 'react'
import './GameplayArea.css'
import TopBar from "../TopBar/TopBar";
import Board from "../Board/Board";
import InfoButton from "../InfoButton/InfoButton";
import GameOver from "../GameOver/GameOver";

class GameplayArea extends React.Component {
    topBarRef;
    boardRef;
    constructor(props){
        super(props);
        this.topBarRef = React.createRef();
        this.boardRef = React.createRef();
    }

    resetGame(){
        this.boardRef.current.resetGame();
    }

    render() {
        return <div className="GameplayArea"><TopBar Controller={this} ref={this.topBarRef}/><Board ref={this.boardRef} GameArea={this}/><InfoButton/></div>
    }
}

export default GameplayArea;