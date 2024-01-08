export enum CountdownState {
  "Stopped" = "stopped",
  "Started" = "started",
  "Finished" = "finished",
}

export type RoomInfo = {
    roomName: string;
    userName: string;
    roomId: string;
    isHost?: boolean;
    countdownState: CountdownState;
  };

  export type SessionType = {
    participants: Map<string, string>;
    votes: Map<string, number>;
    roomName: string;
  };
  
  
  export interface PokerContextProps {
    clientUUID: string;
    roomInfo: RoomInfo;
    setRoomInfo: (roomInfo: RoomInfo) => void;
    pokerSession: SessionType;
    setPokerSession: (pokerSession: SessionType) => void;
    countdownState: CountdownState;
    setCountdownState: (state: CountdownState) => void;
    selectedCard: number | null;
    setSelectedCard: (card: number | null) => void;
  }