import { useState } from 'react';
import { Square } from './components/Square';
import { TURNS } from './constants.js'
import { checkWinnerFrom, checkEndGame } from './logic/board.js';
import { WinnerModal } from './components/WinnerModal';
import confetti from 'canvas-confetti';
import './App.css'

function App() {
  // Dibujamos el tablero
  const [board, setBoard] = useState(() => {
    // Obtenemos el board almacenado en localStorage
    const boardFromStorage = window.localStorage.getItem('board');
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null);
  });
  const [turn, setTurn] = useState(() => {
    // Obtenemos el turno almacenado en localStorage
    const turnFromStorage = window.localStorage.getItem('turn');
    return turnFromStorage ?? TURNS.X;
  });
  const [winner, setWinner] = useState(null); // null es que no hay ganador y false es que hay un empate

  // Funcion para resetear el juego
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);

    // Reseteamos el localStorage
    window.localStorage.removeItem("board");
    window.localStorage.removeItem("turn");
  };

  const updateBoard = (index) => {
    // No actualizamos esta posicion si ya tiene algo 
    if (board[index] || winner) return;

    // Actualizamos el board o tablero
    const newBoard = [...board];
    newBoard[index] = turn; // turno actual, que puede ser x u o
    setBoard(newBoard);

    // Cambiamos el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn); 

    // Guardamos partida en localStorage
    window.localStorage.setItem("board", JSON.stringify(newBoard));
    window.localStorage.setItem("turn", newTurn);

    // Revisamos si hay ganador
    const newWinner = checkWinnerFrom(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false); // Empate, no hay ganador
    }
  };

  return (
    <main className='"board'>
      <h1>Tic tac toe</h1>
      <button className='btn-resetGame' onClick={resetGame}>Reset del juego</button>

      <section className='game'>
        {
          board.map((square, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>

      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner}/>
    </main>
  )
}

export default App
