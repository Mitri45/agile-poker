import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketContextProps {
  socket: Socket | null;
  createRoom: (roomId: string, participants: string, roomName: string) => void;
  endAgilePoker: (roomId: string) => void;
  vote: (roomId: string, participant: string, vote: number) => void;
  connectToTheRoom: (roomId: string, participant: string) => void;
}

const WebSocketContext = createContext<WebSocketContextProps>({
  socket: null,
  createRoom: () => {},
  endAgilePoker: () => {},
  vote: () => {},
  connectToTheRoom: () => {},
});

export const WebSocketProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SERVER, {
      transports: ['websocket'],
    });
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const createRoom = (roomId: string) => {
    if (socket) {
      console.log('Starting Agile Poker session, emit');
      socket.emit('createRoom', { roomId });
    }
  };

  const connectToTheRoom = (roomId: string, participant: string) => {
    if (socket) {
      console.log('Connecting to the room, emit', roomId, participant);
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
      value={{ socket, createRoom, endAgilePoker, vote, connectToTheRoom }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
