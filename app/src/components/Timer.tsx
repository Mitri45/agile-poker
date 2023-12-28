import { useState, useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { usePoker } from '../context/PokerContext';

const CountdownTimer = () => {
  const { serverMessage, socket } = useWebSocket();
  const [countdown, setCountdown] = useState(30);
  const { roomInfo, setRoomInfo } = usePoker();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    console.log(serverMessage);
    console.log('CountdownTimer: useEffect');
    console.log('serverMessage', serverMessage);
    if (serverMessage.has('countdown')) {
      const seconds = serverMessage.get('countdown') as number;
      setCountdown(seconds);
      if (seconds === 0) {
        setRoomInfo({ ...roomInfo, countdownState: 'finished' });
        setIsActive(false);
        setCountdown(30);
      }
    }
  }, [serverMessage]);

  const startCountdown = () => {
    setIsActive(true);
    socket &&
      socket.emit('startCountdown', {
        roomId: roomInfo.roomId,
        countdownDuration: 30,
      });
  };

  const resetCountdown = () => {
    socket && socket.emit('resetCountdown', roomInfo.roomId);
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
