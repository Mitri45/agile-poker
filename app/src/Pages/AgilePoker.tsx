import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { usePoker } from '../context/PokerContext';
import Card from '../components/Card';
import Timer from '../components/Timer';
import DynamicParticipantList from '../components/Participants';

export async function loader({ params }: any) {
  return params.roomId;
}
const pokerNumbers = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

type SessionType = {
  participants: string[];
  votes: Record<string, number>;
  roomName: string;
};

const emptySession: SessionType = {
  participants: [],
  votes: {},
  roomName: '',
};

export default function AgilePokerPage() {
  let location = useLocation();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const { isCreator, roomInfo } = usePoker();

  const { socket, createRoom, vote, connectToTheRoom } = useWebSocket();

  const navigate = useNavigate();
  const [pokerSession, setPokerSession] = useState<SessionType>(emptySession);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const roomId = useLoaderData() as string;

  useEffect(() => {
    if (socket) {
      if (!roomInfo?.userName) {
        // check that room is not empty on the backend
        console.log('Checking room');
        socket.emit('checkRoom', { roomId }, (response: any) => {
          console.log('checkRoom response: ', response);
          if (!response) {
            navigate(`/`, {
              state: { message: 'Room you were trying to access is empty' },
            });
            return;
          } else {
            navigate(`/welcome`, {
              state: { roomId, roomName: response.roomName },
            });
          }
        });
      }
      socket.on('connect', () => {
        if (roomId && location.state?.isHost) {
          console.log('Starting new Agile Poker session room');
          if (roomInfo?.userName && roomInfo?.roomName)
            createRoom(roomId, roomInfo?.userName, roomInfo?.roomName);
        } else if (roomId) {
          console.log('Connecting to the room');
          if (roomInfo?.userName) connectToTheRoom(roomId, roomInfo?.userName);
        }
      });
      socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });
      socket.on(
        'roomCreated',
        ({ participants, votes, roomName }: SessionType) => {
          console.log('Room created', participants, roomName, votes);
          setPokerSession({ ...pokerSession, participants, votes, roomName });
        },
      );
      socket.on('agilePokerUpdate', ({ session }: { session: SessionType }) => {
        console.log('Agile Poker update', session);
        setPokerSession({ ...session });
        console.log('session.votes: ', session.votes);
        if (Object.keys(session.votes).length !== 0)
          setVotes({ ...session.votes });
      });
      socket.on('userJoined', (session) => {
        console.log('Joined room', session);
        setPokerSession({
          ...session,
        });
      });
    }
    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('agilePokerUpdate');
        socket.off('userJoined');
      }
    };
  }, [socket, isCreator, createRoom, roomId, connectToTheRoom]);

  const handleVote = (rank: number) => {
    setSelectedCard(rank === selectedCard ? null : rank);
  };
  const submitVote = () => {
    vote(roomId, roomInfo?.userName, selectedCard!);
  };

  return (
    <div className="flex-grow flex flex-col items-stretch justify-around">
      <div>
        <h2 className="text-3xl text-center font-semibold mb-10 p-5">
          {pokerSession.roomName}
        </h2>
        <div className="flex items-start justify-between px-10">
          <DynamicParticipantList session={pokerSession} />
          <Timer />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex w-full justify-evenly">
          {pokerNumbers.map((rank) => (
            <div className="flex justify-between">
              <Card
                key={rank}
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
  );
}
