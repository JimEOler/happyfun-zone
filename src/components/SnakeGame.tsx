import { useState, useEffect, useCallback, useRef } from 'react';
import { ThemeConfig } from '../types';

interface SnakeGameProps {
  theme: ThemeConfig;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = [number, number];

export default function SnakeGame({ theme }: SnakeGameProps) {
  const COLS = 20;
  const ROWS = 13;
  const INITIAL_SPEED = 160;

  const [snake, setSnake] = useState<Position[]>([
    [7, 5],
    [7, 6],
    [7, 7]
  ]);
  const [food, setFood] = useState<Position>([4, 4]);
  const [direction, setDirection] = useState<Direction>('UP');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('happyfun_snake_high') || '0');
  });
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'OVER' | 'PAUSED'>('IDLE');
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random food position not on the snake
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    while (true) {
      const x = Math.floor(Math.random() * COLS);
      const y = Math.floor(Math.random() * ROWS);
      if (!currentSnake.some(([sX, sY]) => sX === x && sY === y)) {
        return [x, y];
      }
    }
  }, [COLS, ROWS]);

  // Restart Game
  const resetGame = () => {
    const initialSnake: Position[] = [
      [7, 5],
      [7, 6],
      [7, 7]
    ];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('UP');
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameState('PLAYING');
  };

  // Toggle Pause
  const togglePause = () => {
    if (gameState === 'PLAYING') {
      setGameState('PAUSED');
    } else if (gameState === 'PAUSED') {
      setGameState('PLAYING');
    }
  };

  // Handle keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code) && direction !== 'DOWN') {
        e.preventDefault();
        setDirection('UP');
      } else if (['ArrowDown', 'KeyS'].includes(e.code) && direction !== 'UP') {
        e.preventDefault();
        setDirection('DOWN');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code) && direction !== 'RIGHT') {
        e.preventDefault();
        setDirection('LEFT');
      } else if (['ArrowRight', 'KeyD'].includes(e.code) && direction !== 'LEFT') {
        e.preventDefault();
        setDirection('RIGHT');
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'PLAYING') togglePause();
        else if (gameState === 'IDLE' || gameState === 'OVER') resetGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameState]);

  // Game tick loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        let newHead: Position = [head[0], head[1]];

        switch (direction) {
          case 'UP':
            newHead[1] = head[1] - 1;
            break;
          case 'DOWN':
            newHead[1] = head[1] + 1;
            break;
          case 'LEFT':
            newHead[0] = head[0] - 1;
            break;
          case 'RIGHT':
            newHead[0] = head[0] + 1;
            break;
        }

        // Check self collision
        if (prevSnake.some(([x, y]) => x === newHead[0] && y === newHead[1])) {
          setGameState('OVER');
          return prevSnake;
        }

        // Check wall collision (wrap around or fail? Let's fail for retro authentic challenge, or wrap?)
        // Let's do wrap-around to make it super smooth on mobile!
        if (newHead[0] < 0) newHead[0] = COLS - 1;
        if (newHead[0] >= COLS) newHead[0] = 0;
        if (newHead[1] < 0) newHead[1] = ROWS - 1;
        if (newHead[1] >= ROWS) newHead[1] = 0;

        const nextSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          const newScore = score + 10;
          setScore(newScore);
          
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('happyfun_snake_high', String(newScore));
          }

          // Accelerate slightly
          if (speed > 70) {
            setSpeed((s) => s - 4);
          }

          setFood(generateFood(nextSnake));
        } else {
          nextSnake.pop();
        }

        return nextSnake;
      });
    };

    gameLoopRef.current = setTimeout(moveSnake, speed);
    return () => {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    };
  }, [snake, direction, food, gameState, speed, score, highScore, generateFood]);

  // Compile monospaced ASCII rendering
  const grid: string[][] = Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(' '));

  // Render food
  grid[food[1]][food[0]] = '★';

  // Render snake
  snake.forEach(([x, y], idx) => {
    if (idx === 0) {
      // Draw head arrow depending on direction
      let headChar = 'O';
      if (direction === 'UP') headChar = '▲';
      if (direction === 'DOWN') headChar = '▼';
      if (direction === 'LEFT') headChar = '◀';
      if (direction === 'RIGHT') headChar = '▶';
      grid[y][x] = headChar;
    } else {
      grid[y][x] = 'o';
    }
  });

  return (
    <div className="flex flex-col items-center justify-center p-2 max-w-full font-mono select-none" id="snake-game-container">
      {/* Game Stats */}
      <div className="flex justify-between w-full max-w-md border-b pb-1 mb-2 border-dashed border-current text-xs">
        <div>SCORE: {String(score).padStart(4, '0')}</div>
        <div>HI-SCORE: {String(highScore).padStart(4, '0')}</div>
        <div>SPEED: {Math.round(1000 / speed)}t/s</div>
      </div>

      {/* Screen Frame */}
      <div className={`relative flex flex-col p-2 border-2 border-double rounded ${theme.borderClass} ${theme.bgClass} overflow-hidden max-w-full`}>
        {/* Top wall boundary */}
        <div className="text-center font-bold tracking-widest text-xs opacity-70">
          ┌────────────────────────────────────────┐
        </div>

        {/* Board Rows */}
        <div className="leading-tight text-[11px] sm:text-sm tracking-wider font-mono">
          {grid.map((row, y) => (
            <div key={y} className="flex justify-center">
              <span className="opacity-70">│</span>
              {row.map((cell, x) => {
                let cellClass = '';
                if (cell === '★') cellClass = 'animate-pulse text-amber-500 font-bold';
                else if (cell === '▲' || cell === '▼' || cell === '◀' || cell === '▶' || cell === 'O') cellClass = 'font-bold';
                else if (cell === 'o') cellClass = 'opacity-80';
                else cellClass = 'opacity-20';

                return (
                  <span key={x} className={`w-3 h-4 sm:w-4 sm:h-5 text-center inline-block ${cellClass}`}>
                    {cell === ' ' ? '.' : cell}
                  </span>
                );
              })}
              <span className="opacity-70">│</span>
            </div>
          ))}
        </div>

        {/* Bottom wall boundary */}
        <div className="text-center font-bold tracking-widest text-xs opacity-70">
          └────────────────────────────────────────┘
        </div>

        {/* Modal Overlays */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center text-center p-4">
            <p className="text-sm font-bold mb-2 text-yellow-500 animate-pulse">*** TUI SNAKE v1.0 ***</p>
            <p className="text-xs max-w-xs mb-4 opacity-70">Control the cyber-snake. Eat glowing ★ bytes. Avoid biting yourself!</p>
            <button
              onClick={resetGame}
              className={`px-4 py-1.5 border font-bold hover:bg-emerald-500/10 cursor-pointer ${theme.borderClass}`}
              id="snake-btn-start"
            >
              [ ENTER GAME ]
            </button>
            <p className="text-[10px] mt-2 opacity-50">Press Space or Tap to play</p>
          </div>
        )}

        {gameState === 'PAUSED' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center">
            <p className="text-lg font-bold mb-3 tracking-widest text-yellow-500 animate-pulse">== SYSTEM PAUSE ==</p>
            <button
              onClick={togglePause}
              className={`px-3 py-1 border hover:bg-emerald-500/10 text-xs ${theme.borderClass}`}
              id="snake-btn-resume"
            >
              [ RESUME ]
            </button>
          </div>
        )}

        {gameState === 'OVER' && (
          <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center text-center p-4">
            <p className="text-base font-bold text-red-500 tracking-wider mb-1 animate-bounce">CRITICAL OVERFLOW!</p>
            <p className="text-xs mb-1">FINAL SCORE: {score}</p>
            {score === highScore && score > 0 && <p className="text-yellow-400 text-xs font-bold mb-2">NEW LOCAL RECORD!</p>}
            <div className="flex gap-2 mt-2">
              <button
                onClick={resetGame}
                className="px-3 py-1 bg-red-900 border border-red-500 text-white font-bold text-xs hover:bg-red-800"
                id="snake-btn-retry"
              >
                [ REBOOT ]
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Touchpad Controls for iPhone/Android */}
      <div className="mt-4 flex flex-col items-center gap-1 sm:hidden w-44" id="touch-controls">
        <button
          onClick={() => direction !== 'DOWN' && setDirection('UP')}
          className={`w-12 h-10 border rounded flex items-center justify-center active:scale-90 ${theme.borderClass}`}
          id="btn-dir-up"
          aria-label="Move Up"
        >
          ▲
        </button>
        <div className="flex gap-4 w-full justify-between">
          <button
            onClick={() => direction !== 'RIGHT' && setDirection('LEFT')}
            className={`w-12 h-10 border rounded flex items-center justify-center active:scale-90 ${theme.borderClass}`}
            id="btn-dir-left"
            aria-label="Move Left"
          >
            ◀
          </button>
          <button
            onClick={togglePause}
            className={`px-2 text-[10px] border rounded flex items-center justify-center opacity-60 active:scale-95 ${theme.borderClass}`}
            id="btn-dir-pause"
          >
            II
          </button>
          <button
            onClick={() => direction !== 'LEFT' && setDirection('RIGHT')}
            className={`w-12 h-10 border rounded flex items-center justify-center active:scale-90 ${theme.borderClass}`}
            id="btn-dir-right"
            aria-label="Move Right"
          >
            ▶
          </button>
        </div>
        <button
          onClick={() => direction !== 'UP' && setDirection('DOWN')}
          className={`w-12 h-10 border rounded flex items-center justify-center active:scale-90 ${theme.borderClass}`}
          id="btn-dir-down"
          aria-label="Move Down"
        >
          ▼
        </button>
      </div>

      {/* Desktop Helper */}
      <div className="hidden sm:block mt-3 text-[10px] opacity-40 text-center">
        Use WASD / ARROWS to steer • SPACE to Pause • Keep within boundaries
      </div>
    </div>
  );
}
