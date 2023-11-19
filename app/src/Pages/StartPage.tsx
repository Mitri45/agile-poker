import { useLocation, useNavigate } from 'react-router-dom';
import { usePoker } from '../context/PokerContext';
import axios from 'axios';

export default function StartPage() {
  const { userName, setUserName, roomName, setRoomName, setIsCreator } =
    usePoker();
  //TODO: Show a toast if redirected from the empty room
  let location = useLocation();

  const navigate = useNavigate();
  console.log('location.state: ', location.state);
  const handleStartSession = async () => {
    setRoomName(roomName);
    setUserName(userName);
    console.log('Starting session:', roomName, userName);
    try {
      const { data } = await axios.post('http://localhost:3001/getRoomID', {
        roomName,
        userName,
      });
      console.log('Room ID:', data.roomId);
      setIsCreator(true);
      navigate(`/room/${data.roomId}`);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Agile Poker Start Page</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Name:
          </label>
          <input
            type="text"
            title="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-2"
          />
        </div>

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
          onClick={handleStartSession}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Start Agile Poker
        </button>
      </div>
    </div>
  );
}
