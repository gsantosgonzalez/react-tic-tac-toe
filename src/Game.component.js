import React from 'react';

import Board from './Board.component';

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  restartGame() {
    this.setState({
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      const desc = move ?
        'Go to move # ' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button disabled={winner} className="btn btn-link" onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    let statusClass;

    if (winner) {
      status = 'Winner: ' + winner;
      statusClass = 'alert alert-success';

      finishGame(current.squares);
    } else if (history.length === 10) {
      status = 'Draw. Press Restart to begin a fresh match';
      statusClass = 'alert alert-warning';
      moves = null;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      statusClass = 'alert alert-info';
    }

    return (
      <div className="game">
        <div className="row">
          <div className="col-sm-3">
            <div className="text-center">
              <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
              />
            </div>
          </div>
          <div className="col-sm-6">
              <div className={statusClass} role="alert">{status}</div>
              <ol>{moves}</ol>
          </div>
          <div className="col-sm-3">
            <button className="btn btn-primary pull-right" onClick={() => this.restartGame()}>Restart</button>
          </div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

function finishGame(squares) {
  for (let i = 0; i < 9; i++) {
    if (!squares[i] || squares[i] === '') {
      squares[i] = '+';
    }
  }
}
