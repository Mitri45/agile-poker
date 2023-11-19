import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketContextProps {
  socket: Socket | null;
  joinRoom: (sessionId: string, participants: string, roomName: string) => void;
  endAgilePoker: (sessionId: string) => void;
  vote: (sessionId: string, participant: string, vote: number) => void;
  connectToTheRoom: (sessionId: string, participant: string) => void;
}

const WebSocketContext = createContext<WebSocketContextProps>({
  socket: null,
  joinRoom: () => {},
  endAgilePoker: () => {},
  vote: () => {},
  connectToTheRoom: () => {},
});

export const WebSocketProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket'],
    });
    console.log('Connecting to WebSocket server');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinRoom = (roomId: string, participant: string, roomName: string) => {
    if (socket) {
      console.log('Starting Agile Poker session, emit');
      socket.emit('joinRoom', { roomId, participant, roomName });
    }
  };

  const connectToTheRoom = (roomId: string, participant: string) => {
    if (socket) {
      console.log('Connecting to the room, emit');
      socket.emit('connectToTheRoom', { roomId, participant });
    }
  };

  const endAgilePoker = (roomId: string) => {
    if (socket) {
      socket.emit('endAgilePoker', { roomId });
    }
  };

  const vote = (roomId: string, participant: string, vote: number) => {
    if (socket) {
      socket.emit('vote', { roomId, participant, vote });
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ socket, joinRoom, endAgilePoker, vote, connectToTheRoom }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
