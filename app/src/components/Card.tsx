import Tilt from 'react-parallax-tilt';

interface CardProps {
  rank: number;
  isSelected: boolean;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ rank, isSelected, onClick }) => {
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
        onClick={onClick}
        type="button"
      >
        {rank}
      </button>
    </Tilt>
  );
};

export default Card;
