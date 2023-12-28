import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { usePoker } from '../context/PokerContext';
import Card from '../components/Card';
import Timer from '../components/Timer';
import DynamicParticipantList from '../components/Participants';
import GetUsername from './GetUsername';

export async function loader({ params }: any) {
  return params.roomId;
}
const pokerNumbers = [1, 2, 3, 5, 8, 13, 21, 34];

export default function AgilePokerPage() {
  let location = useLocation();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [votedCard, setVotedCard] = useState<number | undefined>();
  const [userJoining, setUserJoining] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log('votedCard: ', votedCard);

  const { roomInfo, pokerSession } = usePoker();

  const { socket, createRoom, vote } = useWebSocket();

  const navigate = useNavigate();
  const roomId = useLoaderData() as string;

  useEffect(() => {
    // Checking that socket connected and we have roomId from the URL
    if (socket && roomId) {
      // Anon user used room URL
      if (!roomInfo?.userName) {
        // check that room is not empty on the backend
        console.log('Checking room');
        socket.emit('checkRoom', { roomId }, (response: any) => {
          console.log('checkRoom response: ', response);
          if (response) {
            console.log('getting username');
            setLoading(false);
            setUserJoining(true);
          } else {
            // No such room exist - starting new session
            navigate(`/`, {
              state: { message: 'Room you were trying to access is empty' },
            });
          }
        });
      } else {
        // Create room as a host
        console.log('Room name exist', pokerSession);
        if (location.state?.isHost && pokerSession.participants.length === 0) {
          console.log('Creating room');
          createRoom(roomId, roomInfo);
          setLoading(false);
        }
      }
    }
  }, [socket, createRoom, roomId, pokerSession]);

  const handleVote = (rank: number) => {
    setSelectedCard(rank === selectedCard ? null : rank);
  };
  const submitVote = () => {
    vote(roomId, roomInfo?.userName, selectedCard!);
  };
  console.log('pokerSession: ', pokerSession);

  return (
    <div className="flex-grow flex flex-col items-center justify-around">
      {loading ? (
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
                    onClick={() => handleVote(rank)}
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn mt-10 bg-blue-500 text-white p-2 rounded w-[200px]"
              onClick={() => submitVote()}
            >
              Vote
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
