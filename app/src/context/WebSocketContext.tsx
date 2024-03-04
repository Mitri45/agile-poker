import { createContext, useContext, useEffect, useState, PropsWithChildren } from "react";
import { io, Socket } from "socket.io-client";
import { usePoker } from "./PokerContext";
import { SessionType } from "../../../types";
import { useNavigate } from "react-router-dom";

interface WebSocketContextProps {
	socket: Socket | null;
	createRoom: (roomId: string, roomName: string, userName: string) => void;
	endAgilePoker: (roomId: string) => void;
	vote: (roomId: string, participant: string, vote: number | null) => void;
	connectToTheRoom: (roomId: string, userName: string, clientUUID: string) => void;
	updateRoomTopic: (roomId: string, topic: string) => void;
}

const WebSocketContext = createContext<WebSocketContextProps>({
	socket: null,
	createRoom: () => {},
	endAgilePoker: () => {},
	vote: () => {},
	connectToTheRoom: () => {},
	updateRoomTopic: () => {},
});

export const WebSocketProvider = ({ children }: PropsWithChildren) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [{ clientUUID }, { setPokerSession }] = usePoker();
	const navigate = useNavigate();

	function deserializedSessionInfo(sessionInfo: SessionType) {
		return {
			...sessionInfo,
			roomName: sessionInfo.roomName,
			participants: new Map(sessionInfo.participants),
			host: sessionInfo.host,
		};
	}

	useEffect(() => {
		const newSocket = io(import.meta.env.VITE_SERVER, {
			transports: ["websocket"],
		});
		setSocket(newSocket);
		if (newSocket) {
			newSocket.on("connect", () => {
				if (newSocket.recovered) {
					// any event missed during the disconnection period will be received now
					//TODO: recover session
				} else {
					// new or unrecoverable session
					// TODO: // newSocket.emit("checkRoom", { roomId }, (response: { status: string; roomName: string; error?: string }) => {
				}
			});
			newSocket.on("roomCreated", (sessionInfo: SessionType) => {
				setPokerSession(deserializedSessionInfo(sessionInfo));
			});
			newSocket.on("agilePokerUpdate", (sessionInfo: SessionType) => {
				setPokerSession(deserializedSessionInfo(sessionInfo));
			});
			newSocket.on("userJoined", (sessionInfo) => {
				setPokerSession(deserializedSessionInfo(sessionInfo));
			});
			newSocket.on("roomDeleted", () => {
				console.log("roomDeleted");
				setPokerSession({ participants: new Map(), roomName: "" });
				navigate("/", {
					state: {
						message: "Host has ended the session. You've been redirected to the main page.",
					},
				});
			});
		}
		return () => {
			newSocket.disconnect();
		};
	}, [setPokerSession, navigate]);

	const createRoom = (roomId: string, userName: string, roomName: string) => {
		if (socket) {
			socket.emit("createRoom", { roomId, userName, roomName, clientUUID });
		}
	};

	const connectToTheRoom = (roomId: string, userName: string, clientUUID: string) => {
		if (socket) {
			socket.emit("connectToTheRoom", { roomId, userName, clientUUID });
		}
	};

	const endAgilePoker = (roomId: string) => {
		if (socket) {
			socket.emit("endAgilePoker", { roomId });
		}
	};

	const vote = (roomId: string, participant: string, vote: number | null) => {
		if (socket) {
			socket.emit("vote", { roomId, participant, vote });
		}
	};
	const updateRoomTopic = (roomId: string, topic: string) => {
		if (socket) {
			socket.emit("updateRoomTopic", { roomId, newRoomName: topic });
		}
	};

	return (
		<WebSocketContext.Provider
			value={{
				socket,
				createRoom,
				endAgilePoker,
				vote,
				connectToTheRoom,
				updateRoomTopic,
			}}
		>
			{children}
		</WebSocketContext.Provider>
	);
};

export const useWebSocket = () => useContext(WebSocketContext);

//TODO: instead of participant names track Client.id everywhere
