import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { RoomInfo, usePoker } from './PokerContext';
import { Session } from '../../../types';

interface WebSocketContextProps {
  socket: Socket | null;
  createRoom: (roomId: string, roomInfo: RoomInfo) => void;
  endAgilePoker: (roomId: string) => void;
  vote: (roomId: string, participant: string, vote: number) => void;
  connectToTheRoom: (roomId: string, participant: string) => void;
  serverMessage: Map<string, string | number>;
}

const WebSocketContext = createContext<WebSocketContextProps>({
  socket: null,
  createRoom: () => {},
  endAgilePoker: () => {},
  vote: () => {},
  connectToTheRoom: () => {},
  serverMessage: new Map(),
});

export const WebSocketProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [serverMessage, setServerMessage] = useState<
    Map<string, string | number>
  >(new Map());
  const { setRoomInfo, roomInfo, setPokerSession } = usePoker();

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SERVER, {
      transports: ['websocket'],
    });
    setSocket(newSocket);
    if (newSocket) {
      newSocket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });
      newSocket.on('roomCreated', (sessionInfo: Session) => {
        console.log('Room created', sessionInfo);
        setPokerSession(sessionInfo);
      });
      newSocket.on('agilePokerUpdate', (session: Session) => {
        console.log('Agile Poker update', session);
        setPokerSession({ ...session });
        console.log('session.votes: ', session.votes);
      });
      newSocket.on('userJoined', (session) => {
        console.log('Joined room', session);
        setPokerSession({
          ...session,
        });
      });
      newSocket.on('countdown', (value: number) => {
        console.log('Countdown value', roomInfo);
        setRoomInfo({
          ...roomInfo,
          countdownState: 'started',
        });
        console.log('Countdown value', value);
        setServerMessage(new Map(serverMessage.set('countdown', value)));
      });
    }
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const createRoom = (roomId: string, roomInfo: RoomInfo) => {
    if (socket) {
      console.log('Starting Agile Poker session, emit', roomInfo);
      socket.emit('createRoom', { roomId, roomInfo });
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
      value={{
        socket,
        createRoom,
        endAgilePoker,
        vote,
        connectToTheRoom,
        serverMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
