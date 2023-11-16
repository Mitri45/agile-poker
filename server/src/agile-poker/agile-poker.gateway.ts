// src/agile-poker.gateway.ts
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { AgilePokerService } from './agile-poker.service';

@WebSocketGateway()
@Injectable()
export class AgilePokerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private agilePokerService: AgilePokerService) {}
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('startAgilePoker')
  handleStartAgilePoker(
    @MessageBody()
    data: {
      sessionId: string;
      participants: string[];
    },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('handleStartAgilePoker', data);
    this.agilePokerService.startSession(
      client,
      data.sessionId,
      data.participants,
    );
  }

  @SubscribeMessage('endAgilePoker')
  handleEndAgilePoker(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('handleEndAgilePoker');
    this.agilePokerService.endSession(client, data.sessionId);
  }

  @SubscribeMessage('vote')
  handleVote(
    @MessageBody()
    data: {
      sessionId: string;
      participant: string;
      vote: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('vote');
    this.agilePokerService.vote(
      client,
      data.sessionId,
      data.participant,
      data.vote,
    );
  }
}
