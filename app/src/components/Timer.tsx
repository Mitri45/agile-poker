import { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let intervalId: number;

    if (isActive) {
      intervalId = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(intervalId);
            setIsActive(false);
            console.log('Countdown timer expired!');
          } else {
            setMinutes((prevMinutes) => prevMinutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive, minutes, seconds]);

  const startTimer = () => {
    if (minutes > 0 || seconds > 0) {
      setIsActive(true);
    }
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  return (
    <div className="flex items-end">
      <div className="max-w-md p-6 bg-white border rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">
            Minutes:
            <input
              className="border p-2 w-full"
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value))}
            />
          </label>
          <label className="block text-sm font-bold mb-2">
            Seconds:
            <input
              className="border p-2 w-full"
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(parseInt(e.target.value))}
            />
          </label>
        </div>
        <div className="mb-4">
          <button
            className="bg-blue-500 text-white p-2 rounded mr-2"
            onClick={startTimer}
          >
            Start
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded"
            onClick={stopTimer}
          >
            Stop
          </button>
        </div>
        <div>
          <p className="text-lg">
            Time remaining: {String(minutes).padStart(2, '0')}:
            {String(seconds).padStart(2, '0')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
