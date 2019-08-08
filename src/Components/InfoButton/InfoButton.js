import React from 'react'
import Info from "../Info/Info";
import './InfoButton.css';

class InfoButton extends React.Component
{
    constructor(props){
        super(props);
        this.state = {hidden:true};
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    onMouseOver(){
        this.setState({hidden:false});
    }

    onMouseLeave(){
        this.setState({hidden:true});
    }

    render() {
        return <div onMouseEnter={this.onMouseOver} onMouseLeave={this.onMouseLeave} className="InfoButton"><Info hidden={this.state.hidden}/></div>
    }
}

export default InfoButton;