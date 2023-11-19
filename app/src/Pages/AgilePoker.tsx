import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { usePoker } from '../context/PokerContext';

export async function loader({ params }: any) {
  return params.roomId;
}

export default function AgilePokerPage() {
  const { socket, joinRoom, endAgilePoker, vote, connectToTheRoom } =
    useWebSocket();
  const {
    userName,
    roomName,
    isCreator,
    setRoomParticipants,
    roomParticipants,
  } = usePoker();

  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const roomId = useLoaderData() as string;
  console.log('roomId from URL: ', roomId);

  useEffect(() => {
    if (socket) {
      if (!userName) {
        // check that room is not empty on the backend
        console.log('Checking room');
        socket.emit('checkRoom', { roomId }, (response: any) => {
          console.log('checkRoom response: ', response);
          if (!response) {
            navigate(`/`, {
              state: { message: 'Room you trying to access is empty' },
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
        if (roomId && isCreator) {
          console.log('Joining room');
          joinRoom(roomId, userName, roomName);
        } else if (roomId) {
          console.log('Connecting to the room');
          connectToTheRoom(roomId, userName);
        }
      });
      socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });
      socket.on(
        'agilePokerUpdate',
        ({ sessionId, session }: { sessionId: string; session: any }) => {
          console.log('Agile Poker update', session);
          setSessionId(sessionId);
          setParticipants(session.participants);
          console.log('session.votes: ', session.votes);
          if (Object.keys(session.votes).length !== 0)
            setVotes({ ...session.votes });
        },
      );
      socket.on('userJoined', (participant: string) => {
        console.log('Joined room', participant);
        setRoomParticipants([...roomParticipants, participant]);
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
  }, [
    socket,
    isCreator,
    joinRoom,
    roomId,
    userName,
    connectToTheRoom,
    setRoomParticipants,
    roomParticipants,
  ]);

  const handleVote = (voteAmount: number) => {
    if (roomName && userName) {
      vote(roomName, userName, voteAmount);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Agile Poker Web App</h1>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Room: {roomName}</h2>
          <h3 className="text-lg font-semibold mb-2">
            Participants: {roomParticipants.join(', ')}
          </h3>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Participants:</h3>
        </div>
      </div>
    </div>
  );
}
