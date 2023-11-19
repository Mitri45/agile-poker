import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { startAgilePokerDto } from './agile-poker.dto';
import { v5 as uuidv5 } from 'uuid';

@Injectable()
export class AgilePokerService {
  private sessions: Map<
    string,
    { participants: string[]; votes: Record<string, number>; roomName: string }
  > = new Map();
  @WebSocketServer() server: Server;

  startSession({ participant, roomName }: startAgilePokerDto): string {
    const votes: Record<string, number> = {};
    // Generate unique room ID for URL
    const roomId = uuidv5('Agile poker', uuidv5.URL);
    console.log(roomId);
    votes[participant] = -1; // Initialize votes to -1 (not voted)
    this.sessions.set(roomId, { participants: [participant], votes, roomName });
    // this.notifyParticipants(roomId);
    return roomId;
  }
  async checkRoom(roomId: string, client: Socket) {
    console.log('Checking room ' + client);
    const roomConnections = await client.in(roomId).fetchSockets();
    console.log('Clients in the room', roomConnections);
    return roomConnections;
  }
  endSession(roomId: string): void {
    this.sessions.delete(roomId);
    this.notifyParticipants(roomId);
  }

  vote(roomId: string, participant: string, vote: number): void {
    console.log('vote sessions', this.sessions);
    const session = this.sessions.get(roomId);
    if (session && session.participants.includes(participant)) {
      session.votes[participant] = vote;
      this.notifyParticipants(roomId);
    }
  }

  private notifyParticipants(roomId: string): void {
    const session = this.sessions.get(roomId);
    if (session) {
      this.server.emit('agilePokerUpdate', { roomId, session });
    }
  }
}
