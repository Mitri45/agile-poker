import { Test, TestingModule } from '@nestjs/testing';
import { AgilePokerController } from './agile-poker.controller';

describe('AgilePokerController', () => {
  let controller: AgilePokerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgilePokerController],
    }).compile();

    controller = module.get<AgilePokerController>(AgilePokerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
