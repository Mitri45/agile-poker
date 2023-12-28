import React, { createContext, useContext, useState } from 'react';
import { SessionType } from '../types';

export type RoomInfo = {
  roomName: string;
  userName: string;
  roomId: string;
  isHost?: boolean;
  countdownState: 'stopped' | 'started' | 'finished';
};

interface PokerContextProps {
  roomInfo: RoomInfo;
  setRoomInfo: (roomInfo: RoomInfo) => void;
  pokerSession: SessionType;
  setPokerSession: (pokerSession: SessionType) => void;
}

const PokerContext = createContext<PokerContextProps>({
  roomInfo: {
    roomName: '',
    userName: '',
    roomId: '',
    countdownState: 'stopped',
  },
  setRoomInfo: () => {},
  pokerSession: { participants: [], votes: {} },
  setPokerSession: () => {},
});

export const PokerProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({
    roomName: '',
    userName: '',
    roomId: '',
    countdownState: 'stopped',
    isHost: false,
  });
  const [pokerSession, setPokerSession] = useState<SessionType>({
    participants: [],
    votes: {},
  });
  return (
    <PokerContext.Provider
      value={{
        roomInfo,
        setRoomInfo,
        pokerSession,
        setPokerSession,
      }}
    >
      {children}
    </PokerContext.Provider>
  );
};

export const usePoker = () => useContext(PokerContext);
