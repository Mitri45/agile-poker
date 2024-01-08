import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { SessionType } from '../../../types';

@Injectable()
export class AgilePokerService {
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
      session.participants.set(clientUUID, userName);
      session.votes.set(clientUUID, -1);
    }
  }

  endUserSession(roomId: string, clientUUID: string): void {
    const session = AgilePokerService.sessions.get(roomId);
    if (session) {
      session.participants.delete(clientUUID);
      session.votes.delete(clientUUID);
    }
  }

  vote(roomId: string, participant: string, vote: number): void {
    const session = AgilePokerService.sessions.get(roomId);
    if (session && session.participants.has(participant)) {
      session.votes.delete(participant);
      session.votes.set(participant, vote);
    }
  }
}
