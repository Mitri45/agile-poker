import { Controller, Param, Post, Req } from '@nestjs/common';
import { ConnectToRoomDto, CreateRoomDto } from './agile-poker.dto';
import { AgilePokerService } from './agile-poker.service';

@Controller()
export class AgilePokerController {
  constructor(private agilePokerService: AgilePokerService) {}
  // Create new websocket server
  @Post('getRoomID')
  getRoomId(@Req() { body }: CreateRoomDto) {
    console.log('startAgilePoker');
    console.log(body);
    // Start websocket server for this roomID
    const uniqueRoomUrl = this.agilePokerService.prepareSession(body);
    return { status: 'ok', roomId: uniqueRoomUrl };
  }

  // Connect to existing websocket server
  @Post('poker/:roomID')
  poker(
    @Req() connectToRoomDto: ConnectToRoomDto,
    @Param() { roomID }: { roomID: string },
  ) {
    console.log('poker');
    console.log(connectToRoomDto.body.participant);
    console.log(roomID);
    return { status: 'ok' };
  }
}
