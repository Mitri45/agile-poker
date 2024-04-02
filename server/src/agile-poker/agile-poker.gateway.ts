import {
	WebSocketGateway,
	OnGatewayConnection,
	OnGatewayDisconnect,
	MessageBody,
	SubscribeMessage,
	WebSocketServer,
	ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AgilePokerService } from "./agile-poker.service";
import { SessionType } from "../../../types";
type ExtendedSocket = Socket & { host: boolean; roomId: string; UUID: string };

@WebSocketGateway()
export class AgilePokerGateway implements OnGatewayConnection, OnGatewayDisconnect {
	static countdownInterval: NodeJS.Timeout;
	private _disconnectionInterval: NodeJS.Timeout;

	_handleHostDisconnect(socket: ExtendedSocket, roomId: string) {
		console.log("_handleHostDisconnect");
		const session = this.agilePokerService.getSession(socket.data.roomId);
		console.log("session", session, socket.data.roomId, socket.data.UUID, socket.data.host);
		const participants = session.participants;
		participants.delete(session.host);
		if (AgilePokerGateway.countdownInterval) {
			clearInterval(AgilePokerGateway.countdownInterval);
			AgilePokerGateway.countdownInterval = null;
		}
		if (participants.size > 0) {
			const newHost = participants.keys().next().value;
			session.host = newHost;
			session.hostUpdated = true;
			this.io.to(roomId).emit("agilePokerUpdate", this._serializedSession(session));
			this.io
				.to(roomId)
				.emit("announcement", `Host has left the session. New host is ${participants.get(newHost).userName}`);
		} else {
			this.io.in(roomId).emit("roomDeleted");
			AgilePokerService.sessions.delete(roomId);
			this.io.in(roomId).disconnectSockets();
		}
		clearInterval(this._disconnectionInterval);
		this._disconnectionInterval = null;
	}

	_serializedSession(session: SessionType) {
		return {
			participants: [...session.participants.entries()],
			roomName: session.roomName,
			host: session.host,
			hostUpdated: session?.hostUpdated ?? false,
		};
	}

	@WebSocketServer() io: Server;
	constructor(private agilePokerService: AgilePokerService) {}

	handleConnection(socket: ExtendedSocket) {
		if (socket.recovered) {
			const session = this.agilePokerService.getSession(socket.data.roomId);
			if (session) {
				const { participants } = session;
				const participant = participants.get(socket.data.UUID);
				if (participant) {
					this.io.to(socket.data.roomId).emit("agilePokerUpdate", this._serializedSession(session));
				}
				if (socket.data.host) {
					clearInterval(this._disconnectionInterval);
				}
			}
		}
	}

	handleDisconnect(socket: ExtendedSocket) {
		if (socket.data.host) {
			console.log("Setting interval");
			this._disconnectionInterval = setInterval(() => {
				this._handleHostDisconnect(socket, socket.data.roomId);
			}, 5000);
		}
	}

	@SubscribeMessage("createRoom")
	handleCreateRoom(
		@MessageBody()
		{
			roomId,
			userName,
			roomName,
			clientUUID,
		}: {
			roomId: string;
			userName: string;
			roomName: string;
			clientUUID: string;
		},
		@ConnectedSocket()
		socket: ExtendedSocket,
	) {
		socket.leave(socket.id);
		const participants = new Map();
		participants.set(clientUUID, {
			userName,
			vote: -1,
			cardBackNumber: String(Math.floor(Math.random() * 9)),
		});
		AgilePokerService.sessions.set(roomId, { participants, roomName, host: clientUUID });
		socket.data.host = true;
		socket.data.roomId = roomId;
		socket.data.UUID = clientUUID;
		const session = AgilePokerService.sessions.get(roomId);
		socket.join(roomId);
		this.io.to(roomId).emit("roomCreated", this._serializedSession(session));
	}

	@SubscribeMessage("connectToTheRoom")
	handleConnectToTheRoom(
		@MessageBody()
		{ roomId, userName, clientUUID }: { roomId: string; userName: string; clientUUID: string },
		@ConnectedSocket()
		socket: ExtendedSocket,
	) {
		socket.data.roomId = roomId;
		socket.data.UUID = clientUUID;
		socket.join(roomId);
		this.agilePokerService.updateParticipants(roomId, userName, clientUUID);
		const session = this.agilePokerService.getSession(roomId);
		this.io.to(roomId).emit("userJoined", this._serializedSession(session));
	}

	@SubscribeMessage("checkRoom")
	handleCheckRoom(@MessageBody() data: { roomId: string }) {
		const rooms = this.io.sockets.adapter.rooms;
		// check how many connections in the room
		const isRoomExist = rooms.get(data.roomId)?.size;
		if (isRoomExist) {
			const session = this.agilePokerService.getSession(data.roomId);
			return { status: "ok", roomName: session.roomName };
		}
		return { status: "error", error: "Room does not exist" };
	}

	@SubscribeMessage("vote")
	handleVote(
		@MessageBody()
		data: {
			roomId: string;
			participant: string;
			vote: number;
		},
	) {
		this.agilePokerService.vote(data.roomId, data.participant, data.vote);
		const session = this.agilePokerService.getSession(data.roomId);
		this.io.to(data.roomId).emit("agilePokerUpdate", this._serializedSession(session));
	}

	@SubscribeMessage("updateRoomTopic")
	handleUpdateRoomTopic(
		@MessageBody()
		{ roomId, newRoomName }: { roomId: string; newRoomName: string },
	): void {
		const session = this.agilePokerService.getSession(roomId);
		if (session) {
			session.roomName = newRoomName;
			this.io.to(roomId).emit("agilePokerUpdate", this._serializedSession(session));
		}
	}

	@SubscribeMessage("startCountdown")
	handleStartCountdown(
		@MessageBody()
		{ roomId, countdownDuration }: { roomId: string; countdownDuration: number },
	): void {
		const initialCountdownDuration = countdownDuration;
		const session = this.agilePokerService.getSession(roomId);
		if (session) {
			for (const participant of session.participants) {
				participant[1].vote = -1;
			}
			this.io.to(roomId).emit("agilePokerUpdate", this._serializedSession(session));
			if (!AgilePokerGateway.countdownInterval) {
				this.io.to(roomId).emit("startCountdown");
				countdownDuration--;
				AgilePokerGateway.countdownInterval = setInterval(() => {
					this.io.to(roomId).emit("countdown", countdownDuration);
					countdownDuration--;
					if (countdownDuration < 0) {
						clearInterval(AgilePokerGateway.countdownInterval);
						AgilePokerGateway.countdownInterval = null;
						this.io.to(roomId).emit("countdown", initialCountdownDuration);
					}
				}, 1000);
			}
		}
	}
}
