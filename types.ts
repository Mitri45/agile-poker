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

  export type Session = {
    participants: string[];
    votes: Record<string, number>;
    roomName: string;
  };