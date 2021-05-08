import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows=3, ncols=3, chanceLightStartsOn=0.5 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];

    for (let y = 0; y < ncols; y++) {
        initialBoard[y] = [];
        for(let x = 0; x < nrows; x++) {
            initialBoard[y].push(Math.random() > chanceLightStartsOn ? true : false);
        }
    }

    return initialBoard;
  }

  function hasWon() {
    return board.every(row => row.every(lit => lit === false));
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Make a (deep) copy of the oldBoard
      const boardCopy = oldBoard.map(row => row.map(light => light));

      // in the copy, flip this cell and the cells around it
      flipCell(y, x, boardCopy);
      flipCell(y-1, x, boardCopy);
      flipCell(y+1, x, boardCopy);
      flipCell(y, x-1, boardCopy);
      flipCell(y, x+1, boardCopy);

      // return the copy
      return boardCopy;
    });
  }

  let HTML;
  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) HTML = <h1>You won!</h1>;

  // make table board
  else HTML = (
    <table className="Board">
      <tbody>
        {board.map((row, rowIndx) => (
          <tr key={rowIndx}>
            {row.map((light, lightIndx) => (
              <Cell 
                key={`${rowIndx}-${lightIndx}`}
                isLit={light} 
                flipCellsAroundMe={() => flipCellsAround(`${rowIndx}-${lightIndx}`)} 
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return HTML;
}

export default Board;
