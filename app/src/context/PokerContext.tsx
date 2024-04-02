import { PropsWithChildren, createContext, useContext, useMemo, useState } from "react";
import { CountdownState, PokerContextProps, RoomInfo, SessionType } from "../../../types";

const PokerContext = createContext<PokerContextProps>([
	{
		roomInfo: {
			userName: "",
			roomId: "",
			isHost: false,
		},
		pokerSession: {
			participants: new Map(),
			roomName: "",
		},
		countdownState: CountdownState.Stopped,
		selectedCard: null,
		clientUUID: localStorage.getItem ? localStorage.getItem("clientUUID") : "",
	},
	{
		setRoomInfoAttribute: () => {},
		setPokerSession: () => {},
		setCountdownState: () => {},
		setRoomName: () => {},
		setSelectedCard: () => {},
	},
]);

export const PokerProvider = ({ children }: PropsWithChildren) => {
	const [roomInfo, setRoomInfo] = useState<RoomInfo>({
		userName: "",
		roomId: "",
		isHost: false,
	});

	const [pokerSession, setPokerSession] = useState<SessionType>({
		participants: new Map(),
		roomName: "",
	});

	const [countdownState, setCountdownState] = useState<CountdownState>(CountdownState.Stopped);
	const [selectedCard, setSelectedCard] = useState<number | null>(null);
	const handlers = useMemo(
		() => ({
			setRoomInfoAttribute: (roomInfo: Partial<RoomInfo>) => {
				setRoomInfo((prev) => {
					return { ...prev, ...roomInfo };
				});
			},
			setRoomName: (roomName: string) => {
				setPokerSession((prev) => {
					return { ...prev, roomName };
				});
			},
			setPokerSession,
			setCountdownState,
			setSelectedCard,
		}),
		[],
	);

	const getters = {
		roomInfo,
		pokerSession,
		countdownState,
		selectedCard,
		clientUUID: localStorage.getItem ? localStorage.getItem("clientUUID") : "",
	};

	return <PokerContext.Provider value={[getters, handlers]}>{children}</PokerContext.Provider>;
};

export const usePoker = () => useContext(PokerContext);
