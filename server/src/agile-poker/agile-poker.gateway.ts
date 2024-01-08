import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AgilePokerService } from './agile-poker.service';
import { RoomInfo, SessionType } from '../../../types';
type ExtendedSocket = Socket & { host: boolean; roomId: string; UUID: string };

@WebSocketGateway()
export class AgilePokerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  static countdownInterval: NodeJS.Timeout;
  _serializedSession(session: SessionType) {
    return {
      participants: [...session.participants.entries()],
      votes: [...session.votes.entries()],
      roomName: session.roomName,
    };
  }
  @WebSocketServer() server: Server;
  constructor(private agilePokerService: AgilePokerService) {}

  handleConnection(client: ExtendedSocket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: ExtendedSocket) {
    console.log('Client disconnected:', client.roomId);
    const session = this.agilePokerService.getSession(client.roomId);
    if (session) {
      const { participants } = session;
      const participant = participants.get(client.UUID);
      if (participant) {
        this.agilePokerService.endUserSession(client.roomId, client.UUID);
        this.server.to(client.roomId).emit('agilePokerUpdate', this._serializedSession(session));
      }
    }
    if (client.host) {
      if (AgilePokerGateway.countdownInterval) {
        clearInterval(AgilePokerGateway.countdownInterval);
        AgilePokerGateway.countdownInterval = null;
      }
      AgilePokerService.sessions.delete(client.roomId);
      this.server.disconnectSockets();
    }
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(
    @MessageBody()
    { roomId, roomInfo, clientUUID }: { roomId: string; roomInfo: RoomInfo; clientUUID: string },
    @ConnectedSocket()
    client: ExtendedSocket,
  ): void {
    const { roomName, userName } = roomInfo;
    const votes = new Map();
    votes.set(clientUUID, -1);
    const participants = new Map();
    participants.set(clientUUID, userName);
    // Initialize votes to -1 (not voted)
    AgilePokerService.sessions.set(roomId, {
      participants,
      votes,
      roomName,
    });
    client.host = true;
    client.roomId = roomId;
    client.UUID = clientUUID;
    const session = AgilePokerService.sessions.get(roomId);
    client.join(roomId);
    this.server.to(roomId).emit('roomCreated', this._serializedSession(session));
  }

  @SubscribeMessage('connectToTheRoom')
  handleConnectToTheRoom(
    @MessageBody()
    { roomId, userName, clientUUID }: { roomId: string; userName: string; clientUUID: string },
    @ConnectedSocket() client: ExtendedSocket,
  ): void {
    client.roomId = roomId;
    client.UUID = clientUUID;
    client.join(roomId);
    this.agilePokerService.updateParticipants(roomId, userName, clientUUID);
    const session = this.agilePokerService.getSession(roomId);
    this.server.to(roomId).emit('userJoined', this._serializedSession(session));
  }

  @SubscribeMessage('checkRoom')
  handleCheckRoom(@MessageBody() data: { roomId: string }) {
    const rooms = this.server.sockets.adapter.rooms;
    // check how many connections in the room
    const isRoomExist = rooms.get(data.roomId)?.size;
    if (isRoomExist) {
      const session = this.agilePokerService.getSession(data.roomId);
      return { status: 'ok', roomName: session.roomName };
    } else {
      return { status: 'error', error: 'Room does not exist' };
    }
  }

  @SubscribeMessage('vote')
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
    this.server.to(data.roomId).emit('agilePokerUpdate', this._serializedSession(session));
  }

  @SubscribeMessage('startCountdown')
  handleStartCountdown(
    @MessageBody()
    { roomId, countdownDuration }: { roomId: string; countdownDuration: number },
  ): void {
    const session = this.agilePokerService.getSession(roomId);
    if (session) {
      session.votes.clear();
      if (!AgilePokerGateway.countdownInterval) {
        this.server.to(roomId).emit('startCountdown');
        AgilePokerGateway.countdownInterval = setInterval(() => {
          this.server.to(roomId).emit('countdown', countdownDuration);
          countdownDuration--;
          if (countdownDuration < 0) {
            clearInterval(AgilePokerGateway.countdownInterval);
            AgilePokerGateway.countdownInterval = null;
          }
        }, 1000);
      }
    }
  }
}
