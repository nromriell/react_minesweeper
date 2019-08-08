import React from 'react'
import './VisualCounter.css'

class VisualCounter extends React.Component {
    counter;
    constructor(props){
        super(props);
        this.state = {value:0};
    }

    setValue(value){
        this.setState({value:value});
    }

    stopTimer(){
        clearInterval(this.counter);
    }

    startTimer(){
        this.counter = setInterval(() => {
            this.setState({value:this.state.value+=1});
            //this.incrementTimer();
            if(this.state.value > 999){
                this.setState({value:999});
                clearInterval(this.counter);
            }
        }, 1000);
    }

    render() {
        return <div className="VisualCounter"><div className="VisualText">{this.state.value}</div></div>
    }
}

export default VisualCounter;