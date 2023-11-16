import { Module } from '@nestjs/common';
import { AgilePokerService } from './agile-poker/agile-poker.service';
import { AgilePokerGateway } from './agile-poker/agile-poker.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [AgilePokerGateway, AgilePokerService],
})
export class AppModule {}
