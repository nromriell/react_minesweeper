import React from 'react'
import './Cell.css'

class Cell extends React.Component {
    needsResetUpdate;

    constructor(props){
        super(props);
        this.needsResetUpdate = false;
        this.state = {flipped:false, flagged:false};
        this.resetState();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("Did update game");
        if(this.needsResetUpdate){
            this.needsResetUpdate = false;
            //this.enableTextTransitions();
        }
    }

    resetState()
    {
        this.needsResetUpdate = true;
        this.setState({flipped:false, flagged:false, textTransitionEnabled:false});
        this.onClick = this.onClick.bind(this);
    }

    enableTextTransitions()
    {
        this.setState({textTransitionEnabled:true});
    }

    setFlipped(depth){
        this.enableTextTransitions();
        this.setState({flipped:true, flagged:this.state.flagged, transitionDelay:depth*0.01});
    }

    toggleFlagged(){
        let newState = !this.state.flagged;
        this.setState({flipped:this.state.flipped, flagged:newState, transitionDelay:0});
        return newState;
    }

    onClick(e){
        e.preventDefault();
        let wasFlag = !(e.button === 0);
        //this.setState({flipped:true});
        this.props.onChange(this, wasFlag);
    }

    getTextClassPerValue()
    {
        if(this.state.flipped) {
            switch (this.props.value) {
                case 1:
                    return " One";
                case 2:
                    return " Two";
                case 3:
                    return " Three";
                case 4:
                    return " Four";
                case 5:
                    return " Five";
                case 6:
                    return " Six";
                case 7:
                    return " Seven";
                case 8:
                    return " Eight";
                default:
                    return "";
            }
        }else {
            return "";
        }
    }

    render () {
        return <div
            style={{transitionDelay:this.state.transitionDelay+"s", animationDelay:this.state.transitionDelay+"s"}}
            className={this.state.flipped ? this.props.isMine ? "Cell Flipped Exploded" : "Cell Flipped" : this.state.flagged ? "Cell Flagged" : "Cell"}
            onMouseDown={this.onClick}>
            <div
                className={"CellText"+this.getTextClassPerValue()+(this.state.textTransitionEnabled ? "" : " NoTransition")} >
                {(this.props.isMine || this.props.value === 0) ? "" : this.props.value}
            </div>
        </div>

    }
}

export default Cell;