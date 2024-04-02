import { Outlet } from 'react-router-dom';
import { PokerProvider } from '../context/PokerContext';
import { WebSocketProvider } from '../context/WebSocketContext';
import Version from '../components/Version';
import { v4 as uuidv4 } from 'uuid';

if (localStorage.getItem('clientUUID') === null) {
  localStorage.setItem('clientUUID', uuidv4());
}

export default function Root() {
  return (
    <PokerProvider>
      <WebSocketProvider>
        <Outlet />
        <Version />
      </WebSocketProvider>
    </PokerProvider>
  );
}
