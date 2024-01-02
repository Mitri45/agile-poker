import {
  createContext,
  useContext,
  useEffect,
  useState,
  FC,
  PropsWithChildren,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { RoomInfo, usePoker } from './PokerContext';
import { Session } from '../../../types';
import { Navigate } from 'react-router-dom';

interface WebSocketContextProps {
  socket: Socket | null;
  createRoom: (roomId: string, roomInfo: RoomInfo) => void;
  endAgilePoker: (roomId: string) => void;
  vote: (roomId: string, participant: string, vote: number | null) => void;
  connectToTheRoom: (roomId: string, participant: string) => void;
}

const WebSocketContext = createContext<WebSocketContextProps>({
  socket: null,
  createRoom: () => {},
  endAgilePoker: () => {},
  vote: () => {},
  connectToTheRoom: () => {},
});

export const WebSocketProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { setPokerSession } = usePoker();

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SERVER, {
      transports: ['websocket'],
    });
    setSocket(newSocket);
    if (newSocket) {
      newSocket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });
      newSocket.on('userLeft', (sessionInfo: Session) => {
        console.log('userLeft', sessionInfo);
      });
      newSocket.on('roomCreated', (sessionInfo: Session) => {
        setPokerSession(sessionInfo);
      });
      newSocket.on('agilePokerUpdate', (session: Session) => {
        setPokerSession({ ...session });
      });
      newSocket.on('userJoined', (session) => {
        setPokerSession({
          ...session,
        });
      });
    }
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const createRoom = (roomId: string, roomInfo: RoomInfo) => {
    if (socket) {
      socket.emit('createRoom', { roomId, roomInfo });
    }
  };

  const connectToTheRoom = (roomId: string, participant: string) => {
    if (socket) {
      socket.emit('connectToTheRoom', { roomId, participant });
    }
  };

  const endAgilePoker = (roomId: string) => {
    if (socket) {
      socket.emit('endAgilePoker', { roomId });
    }
  };

  const vote = (roomId: string, participant: string, vote: number | null) => {
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
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
