import {
  createContext,
  useContext,
  useEffect,
  useState,
  FC,
  PropsWithChildren,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { usePoker } from './PokerContext';
import { RoomInfo, SessionType } from '../../../types';
import { redirect } from 'react-router-dom';

interface WebSocketContextProps {
  socket: Socket | null;
  createRoom: (roomId: string, roomInfo: RoomInfo) => void;
  endAgilePoker: (roomId: string) => void;
  vote: (roomId: string, participant: string, vote: number | null) => void;
  connectToTheRoom: (
    roomId: string,
    userName: string,
    clientUUID: string,
  ) => void;
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
  const { setPokerSession, clientUUID } = usePoker();

  function deserializedSessionInfo(sessionInfo: SessionType) {
    return {
      ...sessionInfo,
      participants: new Map(sessionInfo.participants),
      votes: new Map(sessionInfo.votes),
    };
  }

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SERVER, {
      transports: ['websocket'],
    });
    setSocket(newSocket);
    if (newSocket) {
      newSocket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        redirect('/');
      });
      newSocket.on('roomCreated', (sessionInfo: SessionType) => {
        setPokerSession(deserializedSessionInfo(sessionInfo));
      });
      newSocket.on('agilePokerUpdate', (sessionInfo: SessionType) => {
        setPokerSession(deserializedSessionInfo(sessionInfo));
      });
      newSocket.on('userJoined', (sessionInfo) => {
        setPokerSession(deserializedSessionInfo(sessionInfo));
      });
    }
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const createRoom = (roomId: string, roomInfo: RoomInfo) => {
    if (socket) {
      socket.emit('createRoom', { roomId, roomInfo, clientUUID });
    }
  };

  const connectToTheRoom = (
    roomId: string,
    userName: string,
    clientUUID: string,
  ) => {
    if (socket) {
      socket.emit('connectToTheRoom', { roomId, userName, clientUUID });
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

//TODO: instead of participant names track Client.id everywhere
