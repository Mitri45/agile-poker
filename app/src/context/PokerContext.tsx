import React, { createContext, useContext, useState } from 'react';
import {
  CountdownState,
  PokerContextProps,
  RoomInfo,
  SessionType,
} from '../../../types';

const PokerContext = createContext<PokerContextProps>({
  roomInfo: {
    userName: '',
    roomId: '',
    isHost: false,
    countdownState: CountdownState.Stopped,
  },
  clientUUID: '',
  setRoomInfo: () => {},
  pokerSession: { participants: new Map(), votes: new Map(), roomName: '' },
  setPokerSession: () => {},
  countdownState: CountdownState.Stopped,
  setCountdownState: () => {},
  selectedCard: 0,
  setSelectedCard: () => {},
});

export const PokerProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({
    userName: '',
    roomId: '',
    isHost: false,
    countdownState: CountdownState.Stopped,
  });

  const [pokerSession, setPokerSession] = useState<SessionType>({
    participants: new Map(),
    votes: new Map(),
    roomName: '',
  });
  const [countdownState, setCountdownState] = useState<CountdownState>(
    CountdownState.Stopped,
  );
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  return (
    <PokerContext.Provider
      value={{
        roomInfo,
        setRoomInfo,
        pokerSession,
        setPokerSession,
        countdownState,
        setCountdownState,
        selectedCard,
        setSelectedCard,
        clientUUID: localStorage.getItem('clientUUID')!,
      }}
    >
      {children}
    </PokerContext.Provider>
  );
};

export const usePoker = () => useContext(PokerContext);
