// src/App.tsx
import React, { useEffect, useState } from 'react';
import { useWebSocket } from './context/WebSocketContext';

function App() {
  const { socket, startAgilePoker, endAgilePoker, vote } = useWebSocket();
  const [sessionId, setSessionId] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [votes, setVotes] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (socket) {
      console.log('Socekt', socket);
      socket.on('connect', () => {
        console.log('Connected to WebSocket server');

        // Example: Start Agile Poker session
        startAgilePoker('session123', ['participant1', 'participant2']);

        // Example: End Agile Poker session
        setTimeout(() => {
          endAgilePoker('session123');
        }, 5000);
      });
     socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });
      socket.on('agilePokerUpdate', ({ sessionId, session }: { sessionId: string; session: any }) => {
        setSessionId(sessionId);
        setParticipants(session.participants);
        setVotes(new Map(session.votes));
      });
    }
    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('agilePokerUpdate');
      }
    };
  }, [socket]);

  const handleStartSession = () => {
    startAgilePoker('session123', ['participant1', 'participant2', 'participant3']);
  };

  const handleEndSession = () => {
    endAgilePoker('session123');
  };

  const handleVote = (participant: string, voteNumber: number) => {
    vote(sessionId, participant, voteNumber);
  };

  return (
    <div className="bg-blue-500 text-white p-4">
      <h1 className="text-2xl font-bold">Agile Poker Web App</h1>
      <p>Welcome to your Agile Poker application!</p>

      <div>
        <button onClick={handleStartSession}>Start Session</button>
        <button onClick={handleEndSession}>End Session</button>
      </div>

      <div>
        <h2>Session: {sessionId}</h2>
        <h3>Participants:</h3>
        <ul>
          {participants.map((participant) => (
            <li key={participant}>
              {participant}: {votes.get(participant) !== undefined ? votes.get(participant) : 'Not voted'}
              <button onClick={() => handleVote(participant, 1)}>Vote 1</button>
              <button onClick={() => handleVote(participant, 2)}>Vote 2</button>
              <button onClick={() => handleVote(participant, 3)}>Vote 3</button>
              {/* Add more vote options as needed */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;