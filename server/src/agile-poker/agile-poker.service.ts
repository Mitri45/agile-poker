import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

@Injectable()
export class AgilePokerService {
  private sessions: Map<
    string,
    { participants: string[]; votes: Map<string, number> }
  > = new Map();
  private websocketClient: Socket<DefaultEventsMap, DefaultEventsMap>;

  startSession(
    client: Socket,
    sessionId: string,
    participants: string[],
  ): void {
    this.websocketClient = client;
    const votes = new Map<string, number>();

    participants.forEach((participant) => {
      votes.set(participant, -1); // Initialize votes to -1 (not voted)
    });

    this.sessions.set(sessionId, { participants, votes });
    this.notifyParticipants(sessionId);
  }

  endSession(client: Socket, sessionId: string): void {
    this.websocketClient = client;
    this.sessions.delete(sessionId);
    this.notifyParticipants(sessionId);
  }

  vote(
    client: Socket,
    sessionId: string,
    participant: string,
    vote: number,
  ): void {
    this.websocketClient = client;
    const session = this.sessions.get(sessionId);
    if (session && session.participants.includes(participant)) {
      session.votes.set(participant, vote);
      this.notifyParticipants(sessionId);
    }
  }

  private notifyParticipants(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      console.log('notifyParticipants', session);
      this.websocketClient.emit('agilePokerUpdate', { sessionId, session });
    }
  }
}
