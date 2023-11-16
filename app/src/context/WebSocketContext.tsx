import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketContextProps {
  socket: Socket | null;
  startAgilePoker: (sessionId: string, participants: string[]) => void;
  endAgilePoker: (sessionId: string) => void;
  vote: (sessionId: string, participant: string, vote: number) => void;
}

const WebSocketContext = createContext<WebSocketContextProps>({ socket: null, startAgilePoker: () => {}, endAgilePoker: () => {} , vote: () => {}});




export const WebSocketProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001', { transports: ['websocket'] });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const startAgilePoker = (sessionId: string, participants: string[]) => {
    if (socket) {
      socket.emit('startAgilePoker', { sessionId, participants });
    }
  };

  const endAgilePoker = (sessionId: string) => {
    if (socket) {
      socket.emit('endAgilePoker', { sessionId });
    }
  };

  const vote = (sessionId: string, participant: string, vote: number) => {
    if (socket) {
      socket.emit('vote', { sessionId, participant, vote });
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, startAgilePoker, endAgilePoker, vote }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
