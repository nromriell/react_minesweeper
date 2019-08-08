import React from 'react';
import './Info.css';

const Info = (props) => {
    return <div style={{"display":props.hidden ? "none" : "block"}} className="Info">Use the left or middle mouse button to flag mines</div>
};

export default Info;