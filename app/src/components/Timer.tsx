import { useState, useEffect, useMemo } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { usePoker } from '../context/PokerContext';
import { CountdownState } from '../../../types';

const CountdownTimer = () => {
  const { socket } = useWebSocket();
  const [countdown, setCountdown] = useState(30);
  const { roomInfo, setCountdownState } = usePoker();

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on('startCountdown', () => {
        setCountdownState(CountdownState.Started);
      });
      socket.on('countdown', (value: number) => {
        setCountdown(value);
        if (value === 0) {
          setIsActive(false);
          setCountdownState(CountdownState.Finished);
          setCountdown(30);
        }
      });
    }
  }, []);

  const startCountdown = () => {
    setIsActive(true);
    if (socket) {
      socket.emit('startCountdown', {
        roomId: roomInfo.roomId,
        countdownDuration: 5,
      });
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <p className="text-4xl mb-4">
        <span className="text-red-500">{countdown}</span> sec.
      </p>
      {roomInfo.isHost && (
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400 disabled:hover:bg-slate-400 disabled:cursor-not-allowed"
          onClick={startCountdown}
          disabled={isActive}
        >
          Start Countdown
        </button>
      )}
    </div>
  );
};

export default CountdownTimer;
