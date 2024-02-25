import { Injectable } from "@nestjs/common";
import { WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { SessionType } from "../../../types";

@Injectable()
export class AgilePokerService {
	// Sessions: Map<roomId, SessionType>
	static sessions: Map<string, SessionType> = new Map();

	@WebSocketServer() server: Server;

	getSession(roomId: string) {
		return AgilePokerService.sessions.get(roomId);
	}

	prepareSession(): string {
		return uuidv4();
	}

	updateParticipants(roomId: string, userName: string, clientUUID: string): void {
		const session = AgilePokerService.sessions.get(roomId);
		if (session) {
			session.participants.set(clientUUID, {
				userName: userName,
				vote: -1,
				cardBackNumber: String(Math.floor(Math.random() * 9)),
			});
		}
	}

	endUserSession(roomId: string, clientUUID: string): void {
		const session = AgilePokerService.sessions.get(roomId);
		if (session) {
			session.participants.delete(clientUUID);
		}
	}

	vote(roomId: string, participant: string, vote: number): void {
		const session = AgilePokerService.sessions.get(roomId);
		if (session?.participants.has(participant)) {
			session.participants.set(participant, {
				...session.participants.get(participant),
				vote: vote,
			});
		}
	}
}
