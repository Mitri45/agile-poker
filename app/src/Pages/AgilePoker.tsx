import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { usePoker } from '../context/PokerContext';
import Card from '../components/Card';
import Timer from '../components/Timer';
import DynamicParticipantList from '../components/Participants';
import GetUsername from '../components/GetUsername';

export async function loader({ params }: any) {
  return params.roomId;
}
const pokerNumbers = [1, 2, 3, 5, 8, 13, 21, 34];

export default function AgilePokerPage() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [userJoining, setUserJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { state } = useLocation();
  const { socket } = useWebSocket();
  const { roomInfo, pokerSession } = usePoker();
  const navigate = useNavigate();
  const roomId = useLoaderData() as string;

  useEffect(() => {
    if (state) {
      setIsLoading(state?.isLoading);
    }
  }, []);

  useEffect(() => {
    // Checking that socket connected and we have roomId from the URL
    if (socket && roomId) {
      // Anon user used room URL
      if (!roomInfo?.userName) {
        // check that room is not empty on the backend
        socket.emit('checkRoom', { roomId }, (response: any) => {
          if (response && response.status === 'ok') {
            setIsLoading(false);
            setUserJoining(true);
          }
          if (response && response.status === 'error') {
            // No such room exist - starting new session
            navigate(`/`, {
              state: {
                message: "Room you were trying to access doesn't exist",
              },
            });
          }
        });
      }
    }
  }, [socket, roomId]);
  return (
    <div className="flex-grow flex flex-col items-center justify-around">
      {isLoading ? (
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500 border-solid"></div>
      ) : (
        <div>
          <GetUsername isOpen={userJoining} roomId={roomId} />
          <div>
            <h2 className="text-3xl text-center font-semibold mb-10 p-5">
              {roomInfo.roomName}
            </h2>
            <div className="flex items-start justify-between px-10">
              <DynamicParticipantList session={pokerSession} />
              <Timer />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex w-full justify-evenly">
              {pokerNumbers.map((rank) => (
                <div key={rank} className="flex justify-between">
                  <Card
                    rank={rank}
                    isSelected={rank === selectedCard}
                    setSelectedCard={setSelectedCard}
                    selectedCard={selectedCard}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
