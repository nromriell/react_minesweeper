import React from 'react';
import Cell from '../Cell/Cell';
import CellData from '../Cell/CellData';
import EmotionEnum from '../ResetButton/EmotionsEnum'
import './Board.css'
import GameOver from "../GameOver/GameOver";

const CalculateOffset = (x, y, gridSize) => {return y*gridSize+x};
let activeBoard = {};

class Board extends React.Component {
    cellData = [];
    cells = [];
    cellRefs = [];
    gridSize;
    flipped;
    mineCount;
    totalMines;
    gameStarted;
    gameOver;
    gameWon;
    needsResetUpdate;

    constructor(props){
        super(props);
        this.needsResetUpdate = false;
        activeBoard = this;
        this.calculateDifficultyValues(0);
        this.generateCells();
        this.resetGame();
    }

    componentDidMount() {
        this.props.GameArea.topBarRef.current.mineCounterRef.current.setValue(this.mineCount);
        //onsole.log("Did mount game");
    }

    resetGame(){
        console.log("Resetting Game...");
        this.cellData.forEach((cell, index) => cell.isMine = false);
        //this.forceUpdate();
        //this.generateCells(0);
        this.cellRefs.forEach(cell => {if(cell.current != null)cell.current.resetState()});
        this.calculateDifficultyValues(0);
        this.calculateCellValues();
        this.flipped = 0;
        this.gameStarted = false;
        if(this.props.GameArea != null && this.props.GameArea.topBarRef != null && this.props.GameArea.topBarRef.current != null){
            this.props.GameArea.topBarRef.current.mineCounterRef.current.setValue(this.mineCount);
            this.props.GameArea.topBarRef.current.timerRef.current.stopTimer();
            this.props.GameArea.topBarRef.current.timerRef.current.setValue(0);
            this.props.GameArea.topBarRef.current.resetButtonRef.current.setEmotion(EmotionEnum.BASE);
        }
        this.gameOver = false;
        this.gameWon = false;
        this.gameStarted = false;
        this.forceUpdate();
        this.needsResetUpdate = true;
    }

    calculateDifficultyValues(difficulty){
        this.gridSize = 8;
        this.mineCount = 20;
        switch(difficulty){ //Used switch to allow for more future definitions
            case 1:
                this.gridSize = 16;
                this.mineCount = 40;
                break;
            case 2:
                this.gridSize = 24;
                this.mineCount = 99;
                break;
            default:
                break;
        }
    }

    calculateCellValues()
    {
        let minesRemaining = this.mineCount;
        let random = Math.floor(Math.random()*this.gridSize*this.gridSize);
        while(minesRemaining > 0){
            while(this.cellData[random].isMine){
                random = Math.floor(Math.random()*this.gridSize*this.gridSize);
            }
            this.cellData[random].isMine = true;
            minesRemaining--;
        }
        this.totalMines = this.mineCount;
        this.calculateSurrounding();
    }

    generateCells(){
        console.log("Generating Cells...");
        for(let y = 0; y < this.gridSize; y++){
            for(let x = 0; x < this.gridSize; x++){
                let newCell = new CellData();
                newCell.indexX = x;
                newCell.indexY = y;
                this.cellRefs.push(React.createRef());
                this.cellData.push(newCell);
            }
        }
        console.log("Cells Generated");
    }

    countLeftRightMines(x, y){
        let mineCount = 0;
        if(x > 0) {
            if (this.cellData[CalculateOffset(x - 1, y, this.gridSize)].isMine) {
                mineCount++;
            }
        }
        if(x < this.gridSize-1){
            if (this.cellData[CalculateOffset(x + 1, y, this.gridSize)].isMine) {
                mineCount++;
            }
        }
        return mineCount;
    }

    countMines(x,y){
        let mineCount = 0;
        if(y > 0){ //Check above, above left, above right
            mineCount += this.countLeftRightMines(x, y-1);
            if(this.cellData[CalculateOffset(x, y-1, this.gridSize)].isMine){
                mineCount++;
            }
        }
        if(y < this.gridSize-1){ //Check below, below left, below right
            mineCount += this.countLeftRightMines(x, y+1);
            if(this.cellData[CalculateOffset(x, y+1, this.gridSize)].isMine){
                mineCount++;
            }
        }
        mineCount += this.countLeftRightMines(x,y);
        return mineCount;
    }

    calculateSurrounding(){
        let offset = 0;
        for(let y = 0; y < this.gridSize; y++){
            for(let x = 0; x < this.gridSize; x++){
                offset = CalculateOffset(x,y,this.gridSize);
                if(!this.cellData[offset].isMine){
                    this.cellData[offset].value = this.countMines(x,y);
                }
            }
        }
        this.cells = this.cellData.map((cell, index) => <Cell ref={this.cellRefs[index]} onChange={this.onChildStateChange} indexX={cell.indexX} indexY={cell.indexY} value={cell.value} isMine={cell.isMine} key={index}/>);
        //console.log(newData.length);
    }

    onChildStateChange(cellDef, wasFlag){
        if(!activeBoard.gameStarted){
            activeBoard.gameStarted = true;
            activeBoard.props.GameArea.topBarRef.current.timerRef.current.startTimer();
        }
        if(wasFlag){
            if(!cellDef.state.flipped) {
                if (cellDef.toggleFlagged()) {
                    activeBoard.mineCount--;
                    activeBoard.props.GameArea.topBarRef.current.mineCounterRef.current.setValue(activeBoard.mineCount);
                } else {
                    activeBoard.mineCount++;
                    activeBoard.props.GameArea.topBarRef.current.mineCounterRef.current.setValue(activeBoard.mineCount);
                }
                activeBoard.checkIfWon();
            }
        }else {
            if (!cellDef.props.isMine) {
                if(!cellDef.state.flipped) {
                    activeBoard.flipConnected(cellDef.props.indexX, cellDef.props.indexY);
                    activeBoard.checkIfWon();
                }
            }else {
                //On lose
                console.log("You lost!");
                activeBoard.gameOver = true;
                activeBoard.gameWon = false;
                activeBoard.setState({});
                activeBoard.props.GameArea.topBarRef.current.timerRef.current.stopTimer();
                cellDef.setFlipped(0);
                activeBoard.props.GameArea.topBarRef.current.resetButtonRef.current.setEmotion(EmotionEnum.UNHAPPY);
            }
        }
    }

    checkIfWon()
    {
        console.log("Flipped:"+this.flipped+" Needed:"+(this.gridSize*this.gridSize-this.totalMines));
        console.log("Mine Count:"+this.mineCount);
        if(this.gridSize*this.gridSize-this.totalMines === this.flipped && this.mineCount === 0){
            console.log("WON!");
            this.gameOver = true;
            this.gameWon = true;
            this.setState({});
            activeBoard.props.GameArea.topBarRef.current.timerRef.current.stopTimer();
            activeBoard.props.GameArea.topBarRef.current.resetButtonRef.current.setEmotion(EmotionEnum.VERY_HAPPY);
        }
    }

    flipConnected(indexX, indexY){
        let checked = [];
        for(let i = 0; i < this.cells.length; i++){
            checked.push(0);
        }
        let queue = [{x:indexX, y:indexY}];
        //console.log("X:"+indexX+" Y:"+indexY+" Offset:"+CalculateOffset(indexX, indexY, this.gridSize));
        let depth = 0;
        while(queue.length > 0){
            depth++;
            if(depth > 70)break;
            let next = queue.shift();
            let offset = CalculateOffset(next.x, next.y, this.gridSize);
            checked.splice(offset, 1, 1);
           // console.log(checked[offset]);
            //let oneCount = 0;
            //for(let i = 0; i < checked.length; i++){
                //if(checked[i] === 1) oneCount++;
            //}
           // console.log("Ones:"+oneCount);
           // console.log("X:"+next.x+" Y:"+next.y+" Offset:"+CalculateOffset(indexX, indexY, this.gridSize));
            if(!this.cells[offset].props.isMine) {
                this.flipped += 1;
                this.cellRefs[CalculateOffset(next.x, next.y, this.gridSize)].current.setFlipped(depth);
            }
            if(next.x > 0){
                offset = CalculateOffset(next.x-1, next.y, this.gridSize);
                if(checked[offset] === 0 && !this.cellRefs[offset].current.state.flipped){
                    checked.splice(offset, 1, 1);
                    //this.flipConnected(next.x-1, next.y);
                    if(!this.cells[offset].props.isMine) {
                        queue.push({x: next.x - 1, y: next.y})
                    }
                }
            }
            if(next.x < this.gridSize-1){
                offset = CalculateOffset(next.x+1, next.y, this.gridSize);
                if(checked[offset] === 0 && !this.cellRefs[offset].current.state.flipped){
                    checked.splice(offset, 1, 1);
                    //this.flipConnected(next.x-1, next.y);
                    if(!this.cells[offset].props.isMine) {
                        queue.push({x: next.x + 1, y: next.y})
                    }
                }
            }
            if(next.y > 0){
                offset = CalculateOffset(next.x, next.y-1, this.gridSize);
                if(checked[offset] === 0 && !this.cellRefs[offset].current.state.flipped){
                    checked.splice(offset, 1, 1);
                    //this.flipConnected(next.x-1, next.y);
                    if(!this.cells[offset].props.isMine) {
                        queue.push({x: next.x, y: next.y-1})
                    }
                }
            }
            if(next.y < this.gridSize-1){
                offset = CalculateOffset(next.x, next.y+1, this.gridSize);
                if(checked[offset] === 0 && !this.cellRefs[offset].current.state.flipped){
                    checked.splice(offset, 1, 1);
                    //this.flipConnected(next.x-1, next.y);
                    if(!this.cells[offset].props.isMine) {
                        queue.push({x: next.x, y: next.y+1})
                    }
                }
            }
        }
    }

    render() {
        return <div className="Board">{this.gameOver && <GameOver color={this.gameWon ? "#00ff00":"#ff0000"} value={this.gameWon ? "You Win!" : "Game Over"}/>}{this.cells}</div>
    }
}

export default Board;