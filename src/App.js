import React from 'react';
import './App.css';
import GameplayArea from "./Components/GameplayArea/GameplayArea";

function App() {
  //const game = <Board/>;

  return (
    <div className="App">
        <link href="https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet"/>
        <GameplayArea/>
    </div>
  );
}

export default App;
