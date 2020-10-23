import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Button, ButtonToolbar, Dropdown, DropdownButton } from 'react-bootstrap';

class Box extends React.Component {
  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.col);
  }

  render() {
    return (
      <div
        className={this.props.boxClass}
        id={this.props.id}
        onClick={this.selectBox}
      />
    );
  }
}

// forLoop = () => {
//   for (let i = 0; i < this.props.rows; i++) {
//     for (let j = 0; j < this.props.cols; j++) {

//     }
//   }
// }

class Grid extends React.Component {
  render() {
    // *16 bc theres 16 pixels 
    const width = (this.props.cols * 14);
    var rowsArr = [];

    var boxClass = "";

    // Nested for loop to send data to array 
    for (let i = 0; i < this.props.rows; i++) {
      for (let j = 0; j < this.props.cols; j++) {
        // creates the box id to go with each box
        let boxId = i + " " + j;

        // Checking to see if the box is on or off 
        boxClass = this.props.gridFull[i][j] ? "box on" : "box off"
        rowsArr.push(
          // Pushing a bunch of boxes onto an array
          <Box
            boxClass={boxClass}
            key={boxId}
            boxId={boxId}
            row={i}
            col={j}
            selectBox={this.props.selectBox}
          />
        );
      }
    }
    return (
      <div className="grid" style={{ width: width }}>
        {rowsArr}
      </div>
    )
  }
}

class Buttons extends React.Component {

  handleSelect = (evt) => {
    this.props.gridSize(evt)
  }

  render() {
    return (
      <div className="center">
        <ButtonToolbar>
          <Button variant="outline-success" className="btn-btn-default" onClick={this.props.playButton}>
            Play
          </Button>
          <Button variant="outline-success" className="btn-btn-default" onClick={this.props.pauseButton}>
            Pause
          </Button>
          <Button variant="outline-success" className="btn-btn-default" onClick={this.props.clear}>
            Clear
          </Button>
          <Button variant="outline-success" className="btn-btn-default" onClick={this.props.slow}>
            Slow
          </Button>
          <Button variant="outline-success" className="btn-btn-default" onClick={this.props.fast}>
            Fast
          </Button>
          <Button variant="outline-success" className="btn-btn-default" onClick={this.props.seed}>
            Seed
          </Button>
          <DropdownButton
            variant="outline-success"
            title="Grid Size"
            id="size-menu"
            onSelect={this.handleSelect}>
            <Dropdown.Item eventKey="1">20x10</Dropdown.Item>
            <Dropdown.Item eventKey="2">50x30</Dropdown.Item>
            <Dropdown.Item eventKey="3">70x50</Dropdown.Item>
          </DropdownButton>
        </ButtonToolbar>
      </div>
    )
  }
}

class Main extends React.Component {
  constructor() {
    super();
    this.speed = 100;
    this.rows = 30
    this.cols = 50
    this.state = {
      generation: 0,
      // This creates your two demential array and makes the grid blank 
      gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
    }
  }



  selectBox = (row, col) => {
    // cant update state directly, make a copy array update copy array then 
    // push to original array
    let gridCopy = arrayClone(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col];
    this.setState({
      gridFull: gridCopy
    })
  }

  seed = () => {
    console.log("SEED")
    let gridCopy = arrayClone(this.state.gridFull);
    // need to go through every square of the grid to decide if its on or off
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        // randomly chooses something. Random number between 0-4
        if (Math.floor(Math.random() * 4) === 1) {
          console.log("random")
          gridCopy[i][j] = true;
        }
      }
    }
    this.setState({
      gridFull: gridCopy,
      generation: this.state.generation + 1
    })

  }

  playButton = () => {
    clearInterval(this.intervalId)
    this.intervalId = setInterval(this.play, this.speed);
  }

  slow = () => {
    this.speed = 1000;
    this.playButton();
  }

  fast = () => {
    this.speed = 100;
    this.playButton();
  }
  pauseButton = () => {
    clearInterval(this.intervalId)
  }
  // grid = () => {
  //   Array(this.rows).fill().map(() => Array(this.cols).fill(false))
  // }
  //Try and refactor this into a grid function 
  clear = () => {
    let grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false))

    console.log(this.state)
    this.setState({
      gridFull: grid,
      generation: 0
    })
  }

  gridSize = (size) => {
    switch (size) {
      case "1":
        this.cols = 20;
        this.rows = 10;
        break;
      case "2":
        this.cols = 50;
        this.rows = 30;
        break;
      default:
        this.cols = 70;
        this.rows = 50;

    }
    this.clear();
  }

  play = () => {
    // Check what grid is currently like 
    let g = this.state.gridFull;
    // Change grid on the clone 
    let g2 = arrayClone(this.state.gridFull)

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let count = 0;
        if (i > 0) if (g[i - 1][j]) count++; // im struggling understanding why [i - 1] and then add 1 in count
        if (j > 0) if (g[i][j - 1]) count++;
        if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
        if (i > 0 && j < this.cols - 1) if (g[i - 1][j - 1]) count++;
        if (i < this.rows - 1) if (g[i + 1][j]) count++
        if (j < this.cols - 1) if (g[i][j + 1]) count++;
        if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
        if (i < this.rows - 1 && j < this.cols - 1) if (g[i + 1][j + 1]) count++;

        // if there are less than 2 neighbors or more than 3 the cell dies
        if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false
        // If the cell is dead, but gets 3 neighbors, it is born 
        if (!g[i][j] && count === 3) g2[i][j] = true
      }
    }
    this.setState({
      gridFull: g2,
      generation: this.state.generation + 1
    })
  }

  componentDidMount() {
    this.seed();
    this.playButton();
  }

  render() {
    return (

      <div className="container">
        <div className="textContainer">
          <div className="rulesContainer">
            <h4 className="rulesHeading">Rules of the Game</h4>
            <p className="rules"> 1. If the cell is alive and has 2 or 3 neighbors, then it remains alive. Else it dies.
          2. If the cell is dead and has exactly 3 neighbors, then it comes to life. Else if remains dead</p>
          </div>
          <div className="historyContainer">
            <h4 className="historyHeading">What is the Game of Life?</h4>
            <p className="history">The Game of Life, also known simply as Life,
            is a cellular automaton devised by the British mathematician
            John Horton Conway in 1970.[1] It is a zero-player game,
            meaning that its evolution is determined by its initial state,
            requiring no further input. One interacts with the Game of Life
          by creating an initial configuration and observing how it evolves.</p>
          </div>
        </div>
        {/* passing in grids props */}
        <div className="gridContainer">
          <h1 className="gameTitle">Brian's Game of Life</h1>

          <Buttons
            playButton={this.playButton}
            pauseButton={this.pauseButton}
            slow={this.slow}
            fast={this.fast}
            clear={this.clear}
            seed={this.seed}
            gridSize={this.gridSize}
          />
          <Grid
            gridFull={this.state.gridFull}
            rows={this.rows}
            cols={this.cols}
            selectBox={this.selectBox}
          />
          <h2>Generations: {this.state.generation} </h2>
        </div>
      </div>


    )
  }
}

// This makes the deep clone of the array. Since its nested we need to 
// clone all the arrays inside of arrays vs. slicing
function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}


ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById('root')
);