import React from 'react';
import './TopBar.css'
import VisualCounter from "../VisualCounter/VisualCounter";
import ResetButton from "../ResetButton/ResetButton";

class TopBar extends React.Component{
    mineCounterRef;
    resetButtonRef;
    timerRef;
    constructor(props){
        super(props);
        this.timerRef = React.createRef();
        this.mineCounterRef = React.createRef();
        this.resetButtonRef = React.createRef();
    }

    resetGame(){
        this.props.Controller.resetGame();
    }

    render() {
        return <div className="TopBar"><VisualCounter ref={this.timerRef} isTimer="true"/><ResetButton Controller={this} ref={this.resetButtonRef}/><VisualCounter ref={this.mineCounterRef}/></div>
    }
}

export default TopBar;