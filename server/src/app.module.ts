import { Module } from '@nestjs/common';
import { AgilePokerService } from './agile-poker/agile-poker.service';
import { AgilePokerGateway } from './agile-poker/agile-poker.gateway';
import { AgilePokerController } from './agile-poker/agile-poker.controller';

@Module({
  imports: [],
  controllers: [AgilePokerController],
  providers: [AgilePokerGateway, AgilePokerService],
})
export class AppModule {}
