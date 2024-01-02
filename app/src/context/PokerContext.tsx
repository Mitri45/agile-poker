import React, { createContext, useContext, useState } from 'react';
import { SessionType } from '../types';
import { CountdownState } from '../../../types';

export type RoomInfo = {
  roomName: string;
  userName: string;
  roomId: string;
  isHost?: boolean;
};
interface PokerContextProps {
  roomInfo: RoomInfo;
  setRoomInfo: (roomInfo: RoomInfo) => void;
  pokerSession: SessionType;
  setPokerSession: (pokerSession: SessionType) => void;
  countdownState: CountdownState;
  setCountdownState: (state: CountdownState) => void;
}

const PokerContext = createContext<PokerContextProps>({
  roomInfo: {
    roomName: '',
    userName: '',
    roomId: '',
  },
  setRoomInfo: () => {},
  pokerSession: { participants: [], votes: {} },
  setPokerSession: () => {},
  countdownState: CountdownState.Stopped,
  setCountdownState: () => {},
});

export const PokerProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({
    roomName: '',
    userName: '',
    roomId: '',
    isHost: false,
  });

  const [pokerSession, setPokerSession] = useState<SessionType>({
    participants: [],
    votes: {},
  });
  const [countdownState, setCountdownState] = useState<CountdownState>(
    CountdownState.Stopped,
  );

  return (
    <PokerContext.Provider
      value={{
        roomInfo,
        setRoomInfo,
        pokerSession,
        setPokerSession,
        countdownState,
        setCountdownState,
      }}
    >
      {children}
    </PokerContext.Provider>
  );
};

export const usePoker = () => useContext(PokerContext);
