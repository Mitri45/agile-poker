export class ConnectToRoomDto {
  body: {
    participant: string;
  };
}

export class startAgilePokerDto {
  userName: string;
  roomName: string;
}

export class CreateRoomDto {
  body: startAgilePokerDto;
}
