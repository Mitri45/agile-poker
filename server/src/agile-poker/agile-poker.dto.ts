export class ConnectToRoomDto {
  body: {
    participant: string;
  };
}

export class startAgilePokerDto {
  participant: string;
  roomName: string;
}

export class CreateRoomDto {
  body: startAgilePokerDto;
}
