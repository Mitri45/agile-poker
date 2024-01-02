import Tilt from 'react-parallax-tilt';
import { useWebSocket } from '../context/WebSocketContext';
import { usePoker } from '../context/PokerContext';
import { CountdownState } from '../../../types';

interface CardProps {
  rank: number;
  isSelected: boolean;
  selectedCard: number | null;
  setSelectedCard: (rank: number | null) => void;
}

const Card: React.FC<CardProps> = ({
  rank,
  isSelected,
  setSelectedCard,
  selectedCard,
}) => {
  const { vote } = useWebSocket();
  const { roomInfo, countdownState } = usePoker();
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
          isSelected ? 'bg-green-500' : 'bg-slate-800'
        } w-[100px] h-[150px] rounded-lg text-white text-4xl font-bold transform ${
          isSelected ? 'translate-y-[-20%]' : 'translate-y-0'
        } transition-transform ease-in-out duration-300`}
        onClick={() => {
          if (countdownState !== CountdownState.Started) return;
          setSelectedCard(selectedCard === rank ? null : rank);
          vote(roomInfo.roomId, roomInfo?.userName, rank);
        }}
        type="button"
      >
        {rank}
      </button>
    </Tilt>
  );
};

export default Card;
