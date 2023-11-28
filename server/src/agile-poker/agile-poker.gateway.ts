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

@WebSocketGateway()
export class AgilePokerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(private agilePokerService: AgilePokerService) {}
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(
    @MessageBody()
    data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    console.log('Creating a room with ID', data.roomId);
    const session = this.agilePokerService.getSession(data.roomId);
    client.join(data.roomId);
    this.server.to(data.roomId).emit('roomCreated', session);
  }

  @SubscribeMessage('connectToTheRoom')
  handleConnectToTheRoom(
    @MessageBody()
    data: { roomId: string; participant: string },
    @ConnectedSocket() client: Socket,
  ): void {
    console.log('connectToTheRoom', data);
    client.join(data.roomId);
    this.agilePokerService.updateParticipants(data.roomId, data.participant);
    const session = this.agilePokerService.getSession(data.roomId);
    this.server.to(data.roomId).emit('userJoined', session);
  }

  @SubscribeMessage('endAgilePoker')
  handleEndAgilePoker(@MessageBody() data: { sessionId: string }) {
    console.log('handleEndAgilePoker');
    this.agilePokerService.endSession(data.sessionId);
  }

  @SubscribeMessage('checkRoom')
  handleCheckRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
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
    console.log('vote');
    console.log('handleVote', data);
    this.agilePokerService.vote(data.roomId, data.participant, data.vote);
    const session = this.agilePokerService.getSession(data.roomId);
    this.server
      .to(data.roomId)
      .emit('agilePokerUpdate', { roomId: data.roomId, session });
  }
}
