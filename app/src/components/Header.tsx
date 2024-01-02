import { usePoker } from '../context/PokerContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { roomInfo } = usePoker();

  return (
    <header className="flex w-full h-12 flex-grow-0 items-center">
      <h1 className="font-smooch text-5xl w-1/2">
        <Link to={'/'}>Agile poker</Link>
      </h1>
      <h3 className="w-1/2 text-right pr-10 text-2xl font-kanit">
        {roomInfo.userName || 'Welcome Anon!'}
      </h3>
    </header>
  );
};
export default Header;
