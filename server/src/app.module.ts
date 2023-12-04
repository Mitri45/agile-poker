import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgilePokerService } from './agile-poker/agile-poker.service';
import { AgilePokerGateway } from './agile-poker/agile-poker.gateway';
import { AgilePokerController } from './agile-poker/agile-poker.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AgilePokerController],
  providers: [AgilePokerGateway, AgilePokerService],
})
export class AppModule {}
