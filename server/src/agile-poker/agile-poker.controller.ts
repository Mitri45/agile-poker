import { Controller, Post, Req } from '@nestjs/common';
import { CreateRoomDto } from './agile-poker.dto';
import { AgilePokerService } from './agile-poker.service';

@Controller()
export class AgilePokerController {
  constructor(private agilePokerService: AgilePokerService) {}
  // Create new websocket server
  @Post('getRoomID')
  getRoomId(@Req() { body }: CreateRoomDto) {
    // Start websocket server for this roomID
    const uniqueRoomUrl = this.agilePokerService.prepareSession();
    return { status: 'ok', roomId: uniqueRoomUrl };
  }
}
