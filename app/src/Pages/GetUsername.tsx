import { useLocation, useNavigate } from 'react-router-dom';
import { usePoker } from '../context/PokerContext';

export default function GetUsername() {
  const { userName, setUserName, roomName } = usePoker();

  const navigate = useNavigate();
  let location = useLocation();

  const handleJoinSession = async () => {
    setUserName(userName);
    navigate(`/room/${location.state.roomId}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">
          {' '}
          You are joining room {location.state.roomName}
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name:
          </label>
          <input
            title="Your Name"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>

        <button
          onClick={handleJoinSession}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
