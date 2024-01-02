import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { v5 as uuidv5 } from 'uuid';
import { Session } from '../../../types';

@Injectable()
export class AgilePokerService {
  static sessions: Map<string, Session> = new Map();

  @WebSocketServer() server: Server;

  getSession(roomId: string) {
    return AgilePokerService.sessions.get(roomId);
  }

  prepareSession(): string {
    // Generate unique room ID for URL
    const roomId = uuidv5('Agile poker', uuidv5.URL);
    return roomId;
  }

  updateParticipants(roomId: string, participant: string): void {
    const session = AgilePokerService.sessions.get(roomId);
    if (session) {
      session.participants.push(participant);
      session.votes[participant] = -1;
    }
  }

  vote(roomId: string, participant: string, vote: number): void {
    const session = AgilePokerService.sessions.get(roomId);
    if (session && session.participants.includes(participant)) {
      session.votes[participant] = vote;
    }
  }

  startCountdown(roomId: string): void {
    const session = this.getSession(roomId);
    if (session) {
    }
  }
}
