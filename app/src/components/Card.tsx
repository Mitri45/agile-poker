import Tilt from 'react-parallax-tilt';
import { useWebSocket } from '../context/WebSocketContext';
import { usePoker } from '../context/PokerContext';

interface CardProps {
  rank: number;
}

const Card: React.FC<CardProps> = ({ rank }) => {
  const { vote } = useWebSocket();
  const { roomInfo, selectedCard, setSelectedCard, clientUUID } = usePoker();
  return (
    <Tilt
      tiltMaxAngleX={20}
      tiltMaxAngleY={20}
      glareEnable={true}
      glareMaxOpacity={0.8}
      scale={1.02}
    >
      <button
        className={`${
          selectedCard === rank ? 'bg-green-500' : 'bg-slate-800'
        } w-[100px] h-[150px] rounded-lg text-white text-4xl font-bold transform ${
          selectedCard === rank ? 'translate-y-[-20%]' : 'translate-y-0'
        } transition-transform ease-in-out duration-300`}
        onClick={() => {
          setSelectedCard(selectedCard === rank ? null : rank);
          vote(roomInfo.roomId, clientUUID, selectedCard === rank ? -1 : rank);
        }}
        type="button"
      >
        {rank}
      </button>
    </Tilt>
  );
};

export default Card;
