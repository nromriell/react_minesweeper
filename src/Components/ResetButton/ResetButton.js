import React from 'react'
import './ResetButton.css'

const EmotionClass = ["", " Worried", " Sad", " ExtraHappy"];

class ResetButton extends React.Component
{
    constructor(props){
        super(props);
        this.state = ({emotion:0});
        this.onMouseDown = this.onMouseDown.bind(this);
    }

    onMouseDown(e){
        if(e.button === 0){
            this.props.Controller.resetGame();
        }
    }

    setEmotion(newState){
        this.setState({emotion:newState});
    }

    render() {
        return <div className="ResetBackground"><div onMouseDown={this.onMouseDown} className={"ResetButton"+EmotionClass[this.state.emotion]}/></div>
    }
}

export default ResetButton;