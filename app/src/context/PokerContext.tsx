import React, { createContext, useContext, useState } from 'react';

interface PokerContextProps {
  roomInfo: RoomType;
  setRoomInfo: (roomInfo: RoomType) => void;
  isCreator: boolean;
  setIsCreator: (isCreator: boolean) => void;
  pokerSession: SessionType;
  setPokerSession: (pokerSession: SessionType) => void;
}

const PokerContext = createContext<PokerContextProps>({
  isCreator: false,
  setIsCreator: () => {},
  roomInfo: { roomName: '', userName: '' },
  setRoomInfo: () => {},
  pokerSession: { participants: [], votes: {} },
  setPokerSession: () => {},
});

type SessionType = {
  participants: string[];
  votes: Record<string, number>;
};

type RoomType = {
  roomName: string;
  userName: string;
};

export const PokerProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [roomInfo, setRoomInfo] = useState<RoomType>({
    roomName: '',
    userName: '',
  });
  const [isCreator, setIsCreator] = useState(false);
  const [pokerSession, setPokerSession] = useState<SessionType>({
    participants: [],
    votes: {},
  });
  return (
    <PokerContext.Provider
      value={{
        isCreator,
        setIsCreator,
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
