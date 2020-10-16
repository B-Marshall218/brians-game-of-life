import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ButtonToolbar, MenuItem, DropdownButton } from 'react-bootstrap';

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

class Grid extends React.Component {
  render() {
    // *16 bc theres 16 pixels 
    const width = (this.props.cols * 16);
    var rowsArr = [];

    var boxClass = "";
    // Nested for loop to send data to array 
    for (var i = 0; i < this.props.rows; i++) {
      for (var j = 0; j < this.props.cols; j++) {
        // creates the box id to go with each box
        let boxId = i + "" + j;

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


class Main extends React.Component {
  constructor() {
    super();
    this.speed = 100;
    this.rows = 30
    this.cols = 50
    this.state = {
      genertation: 0,
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
      gridFull: gridCopy
    })

  }

  componentDidMount() {
    this.seed();
  }

  render() {
    return (
      <div>
        <h1>Brian's Game of Life</h1>
        {/* passing in grids props */}
        <Grid
          gridFull={this.state.gridFull}
          rows={this.rows}
          cols={this.cols}
          selectBox={this.selectBox}
        />
        <h2>Generations: {this.state.generation} </h2>
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