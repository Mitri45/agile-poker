import { useState, useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { usePoker } from '../context/PokerContext';
import { CountdownState } from '../../../types';

const CountdownTimer = () => {
  const { socket } = useWebSocket();
  const countdownDuration = 10;
  const [countdown, setCountdown] = useState(countdownDuration);
  const { roomInfo, setCountdownState, countdownState, setSelectedCard } =
    usePoker();

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on('startCountdown', () => {
        setSelectedCard(null);
        setCountdownState(CountdownState.Started);
      });
      socket.on('countdown', (value: number) => {
        setCountdown(value);
        if (value === 0) {
          setIsActive(false);
          setCountdownState(CountdownState.Finished);
          setCountdown(countdownDuration);
        }
      });
    }
  }, []);

  const startCountdown = () => {
    setIsActive(true);
    if (socket) {
      socket.emit('startCountdown', {
        roomId: roomInfo.roomId,
        countdownDuration,
      });
    }
  };
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md">
      {!roomInfo.isHost && (
        <h2 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">
          {countdownState === CountdownState.Started
            ? 'Voting in process'
            : 'Host will start the countdown'}
        </h2>
      )}
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Cast your vote before the timer runs out!
      </p>
      <div className="flex items-center justify-center mb-8">
        <div
          className={`flex items-center justify-center text-white rounded-full w-20 h-20  ${
            countdown < 5 ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          <p className="text-2xl font-bold">{countdown}</p>
        </div>
      </div>
      {roomInfo.isHost && (
        <div className="space-y-4">
          <button
            onClick={startCountdown}
            disabled={isActive}
            type="button"
            className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400"
          >
            {isActive ? 'Voting in progress' : 'Start countdown'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
