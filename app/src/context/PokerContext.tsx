import React, { createContext, useContext, useState } from 'react';

interface PokerContextProps {
  userName: string;
  setUserName: (userName: string) => void;
  roomName: string;
  setRoomName: (roomName: string) => void;
  isCreator: boolean;
  setIsCreator: (isCreator: boolean) => void;
  roomParticipants: string[];
  setRoomParticipants: (roomParticipants: string[]) => void;
}

const PokerContext = createContext<PokerContextProps>({
  userName: '',
  setUserName: () => {},
  roomName: '',
  setRoomName: () => {},
  isCreator: false,
  setIsCreator: () => {},
  roomParticipants: [],
  setRoomParticipants: () => {},
});

export const PokerProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [roomParticipants, setRoomParticipants] = useState<string[]>([]);

  return (
    <PokerContext.Provider
      value={{
        userName,
        setUserName,
        roomName,
        setRoomName,
        isCreator,
        setIsCreator,
        roomParticipants,
        setRoomParticipants,
      }}
    >
      {children}
    </PokerContext.Provider>
  );
};

export const usePoker = () => useContext(PokerContext);
