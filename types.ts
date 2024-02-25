export enum CountdownState {
	Stopped = "stopped",
	Started = "started",
	Finished = "finished",
}

export type RoomInfo = {
	userName: string;
	roomId: string;
	isHost: boolean;
};

export type ParticipantObject = {
	userName: string;
	vote: number;
	cardBackNumber: string;
};

export type SessionType = {
	participants: Map<string, ParticipantObject>;
	roomName: string;
	host?: string;
};

interface PokerContextGetters {
	roomInfo: RoomInfo;
	pokerSession: SessionType;
	countdownState: CountdownState;
	selectedCard: number | null;
	clientUUID: string | null;
}
interface PokerContextHandlers {
	setRoomInfoAttribute: (roomInfo: Partial<RoomInfo>) => void;
	setRoomName: (roomName: string) => void;
	setPokerSession: (pokerSession: SessionType) => void;
	setCountdownState: (countdownState: CountdownState) => void;
	setSelectedCard: (selectedCard: number | null) => void;
}

export type PokerContextProps = [getters: PokerContextGetters, handlers: PokerContextHandlers];
