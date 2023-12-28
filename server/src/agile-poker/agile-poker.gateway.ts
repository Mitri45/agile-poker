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
import { RoomInfo } from '../../../types';
type ExtendedSocket = Socket & { host: string };

@WebSocketGateway()
export class AgilePokerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  static countdownInterval: NodeJS.Timeout;

  @WebSocketServer() server: Server;
  constructor(private agilePokerService: AgilePokerService) {}

  handleConnection(client: ExtendedSocket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: ExtendedSocket) {
    console.log(`Client disconnected: ${client.id}`);
    if (client.host === client.id) {
      console.log('host disconnected clearing');
      if (AgilePokerGateway.countdownInterval) {
        clearInterval(AgilePokerGateway.countdownInterval);
        AgilePokerGateway.countdownInterval = null;
      }
    }
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(
    @MessageBody()
    { roomId, roomInfo }: { roomId: string; roomInfo: RoomInfo },
    @ConnectedSocket() client: ExtendedSocket & { host: string },
  ): void {
    console.log('Creating a room with ID', roomId);
    const { roomName, userName } = roomInfo;
    const votes: Record<string, number> = {};
    votes[userName] = -1; // Initialize votes to -1 (not voted)
    AgilePokerService.sessions.set(roomId, {
      participants: [userName],
      votes,
      roomName,
    });
    client.host = client.id;
    const session = AgilePokerService.sessions.get(roomId);
    console.log('session', session);
    client.join(roomId);
    this.server.to(roomId).emit('roomCreated', session);
  }

  @SubscribeMessage('connectToTheRoom')
  handleConnectToTheRoom(
    @MessageBody()
    data: { roomId: string; participant: string },
    @ConnectedSocket() client: ExtendedSocket,
  ): void {
    console.log('connectToTheRoom', data);
    client.join(data.roomId);
    this.agilePokerService.updateParticipants(data.roomId, data.participant);
    const session = this.agilePokerService.getSession(data.roomId);
    this.server.to(data.roomId).emit('userJoined', session);
  }

  @SubscribeMessage('checkRoom')
  handleCheckRoom(@MessageBody() data: { roomId: string }) {
    const rooms = this.server.sockets.adapter.rooms;
    // check how many connections in the room
    const isRoomExist = rooms.get(data.roomId)?.size;
    console.log('isRoomExist', Boolean(isRoomExist));
    if (isRoomExist) {
      const session = this.agilePokerService.getSession(data.roomId);
      console.log('session', session);

      return { status: 'ok', roomName: session.roomName };
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
    this.server.to(data.roomId).emit('agilePokerUpdate', session);
  }

  @SubscribeMessage('startCountdown')
  handleStartCountdown(
    @MessageBody()
    {
      roomId,
      countdownDuration,
    }: {
      roomId: string;
      countdownDuration: number;
    },
  ): void {
    console.log('startCountdown', roomId);
    const session = this.agilePokerService.getSession(roomId);
    console.log('session', session);
    console.log(
      'AgilePokerGateway.countdownInterval',
      AgilePokerGateway.countdownInterval,
    );
    if (session) {
      if (!AgilePokerGateway.countdownInterval) {
        AgilePokerGateway.countdownInterval = setInterval(() => {
          this.server.to(roomId).emit('countdown', countdownDuration);
          countdownDuration--;
          console.log('this.countdownDuration', countdownDuration);
          if (countdownDuration < 0) {
            clearInterval(AgilePokerGateway.countdownInterval);
            AgilePokerGateway.countdownInterval = null;
          }
        }, 1000);
      }
    }
  }
}
