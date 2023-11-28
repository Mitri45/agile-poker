import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { startAgilePokerDto } from './agile-poker.dto';
import { v5 as uuidv5 } from 'uuid';

@Injectable()
export class AgilePokerService {
  static sessions: Map<
    string,
    { participants: string[]; votes: Record<string, number>; roomName: string }
  > = new Map();
  @WebSocketServer() server: Server;

  getSession(roomId: string) {
    return AgilePokerService.sessions.get(roomId);
  }

  prepareSession({ roomName, userName }: startAgilePokerDto): string {
    const votes: Record<string, number> = {};
    // Generate unique room ID for URL
    const roomId = uuidv5('Agile poker', uuidv5.URL);
    console.log(roomId);
    votes[userName] = -1; // Initialize votes to -1 (not voted)
    AgilePokerService.sessions.set(roomId, {
      participants: [userName],
      votes,
      roomName,
    });
    console.log('sessions', AgilePokerService.sessions.get(roomId));
    return roomId;
  }

  async checkRoom(roomId: string, client: Socket) {
    console.log('Checking room ' + client);
    const roomConnections = await client.in(roomId).fetchSockets();
    console.log('Clients in the room', roomConnections);
    return roomConnections;
  }

  updateParticipants(roomId: string, participant: string): void {
    const session = AgilePokerService.sessions.get(roomId);
    if (session) {
      session.participants.push(participant);
      session.votes[participant] = -1;
    }
  }

  endSession(roomId: string): void {
    AgilePokerService.sessions.delete(roomId);
    this.notifyParticipants(roomId);
  }

  vote(roomId: string, participant: string, vote: number): void {
    console.log('vote sessions', AgilePokerService.sessions);
    const session = AgilePokerService.sessions.get(roomId);
    if (session && session.participants.includes(participant)) {
      session.votes[participant] = vote;
    }
  }

  private notifyParticipants(roomId: string): void {
    const session = AgilePokerService.sessions.get(roomId);
    if (session) {
      this.server.to(roomId).emit('agilePokerUpdate', { roomId, session });
    }
  }
}
