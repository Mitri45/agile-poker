export type SessionType = {
  participants: string[];
  votes: Record<string, number>;
  roomName: string;
};
