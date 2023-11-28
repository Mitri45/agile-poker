import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { usePoker } from '../context/PokerContext';
// import type { SessionType } from '../types';

export async function loader({ params }: any) {
  return params.roomId;
}
type SessionType = {
  participants: string[];
  votes: Record<string, number>;
  roomName: string;
};

type RoomType = {
  roomName: string;
  userName: string;
};

const emptySession: SessionType = {
  participants: [],
  votes: {},
  roomName: '',
};

export default function AgilePokerPage() {
  let location = useLocation();
  const { isCreator, roomInfo } = usePoker();

  const { socket, createRoom, endAgilePoker, vote, connectToTheRoom } =
    useWebSocket();

  const navigate = useNavigate();
  const [pokerSession, setPokerSession] = useState<SessionType>(emptySession);

  const [sessionId, setSessionId] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
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
      socket.on(
        'agilePokerUpdate',
        ({ roomId, session }: { roomId: string; session: SessionType }) => {
          console.log('Agile Poker update', session);
          setPokerSession({ ...session });
          console.log('session.votes: ', session.votes);
          if (Object.keys(session.votes).length !== 0)
            setVotes({ ...session.votes });
        },
      );
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

  const handleVote = (voteAmount: number) => {
    if (roomInfo?.userName) {
      vote(roomId, roomInfo?.userName, voteAmount);
    }
  };
  console.log('roominfo', roomInfo);
  console.log('pokerSession', pokerSession);
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Agile Poker Web App</h1>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">
            Room: {pokerSession.roomName}
          </h2>
          {pokerSession.participants.map((participant) => (
            <div key={participant} className="flex flex-row justify-between">
              <p>{participant}</p>
              <p>{pokerSession.votes[participant]}</p>
            </div>
          ))}
          <h3 className="text-lg font-semibold mb-2">
            Participants: {pokerSession.participants.join(', ')}
          </h3>
          <h3 className="text-lg font-semibold mb-2">
            Your name: {roomInfo.userName}
          </h3>
          <h3 className="text-lg font-semibold mb-2">
            Your vote: {pokerSession.votes[roomInfo.userName]}
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          <button
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-2 px-4 rounded"
            onClick={() => handleVote(1)}
          >
            1
          </button>
          <button
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-2 px-4 rounded"
            onClick={() => handleVote(2)}
          >
            2
          </button>
          <button
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-2 px-4 rounded"
            onClick={() => handleVote(3)}
          >
            3
          </button>
          <button
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-2 px-4 rounded"
            onClick={() => handleVote(5)}
          >
            5
          </button>
          <button
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-2 px-4 rounded"
            onClick={() => handleVote(8)}
          >
            8
          </button>
          <button
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-2 px-4 rounded"
            onClick={() => handleVote(13)}
          >
            13
          </button>
          <button
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-2 px-4 rounded"
            onClick={() => handleVote(21)}
          >
            21
          </button>
          <button
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-2 px-4 rounded"
            onClick={() => handleVote(34)}
          >
            34
          </button>
          <button
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-2 px-4 rounded"
            onClick={() => handleVote(55)}
          >
            55
          </button>
          <button
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-2 px-4 rounded"
            onClick={() => handleVote(89)}
          >
            89
          </button>
        </div>
      </div>
    </div>
  );
}
