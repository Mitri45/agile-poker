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

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody()
    data: { roomId: string; participant: string; roomName: string },
    @ConnectedSocket() client: Socket,
  ): void {
    console.log('handleJoinRoom', data.roomName);
    client.join(data.roomId);
    this.server.to(data.roomId).emit('userJoined', data.participant);
  }

  @SubscribeMessage('connectToTheRoom')
  handleConnectToTheRoom(
    @MessageBody()
    data: { roomId: string; participant: string },
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(data.roomId);
    this.server.to(data.roomId).emit('userJoined', data.participant);
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
    return Boolean(isRoomExist);
  }

  @SubscribeMessage('vote')
  handleVote(
    @MessageBody()
    data: {
      sessionId: string;
      participant: string;
      vote: number;
    },
  ) {
    console.log('vote');
    console.log('handleVote', data);
    this.agilePokerService.vote(data.sessionId, data.participant, data.vote);
  }
}
