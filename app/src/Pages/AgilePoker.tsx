import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { usePoker } from '../context/PokerContext';
import Card from '../components/Card';
import Timer from '../components/Timer';
import DynamicParticipantList from '../components/Participants';
import GetUsername from '../components/GetUsername';
import TopicNameBubble from '../components/TopicNameBubble';
import CopyLink from '../components/CopyLink';
import Toast from '../components/Toast';

export async function loader({ params }: any) {
  return params.roomId;
}
const pokerNumbers = [1, 2, 3, 5, 8, 13, 21];

export default function AgilePokerPage() {
  const [userJoining, setUserJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopyLinkOpen, setIsCopyLinkOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const { state } = useLocation();
  const { socket } = useWebSocket();
  const { roomInfo, pokerSession, setRoomInfo, setPokerSession } = usePoker();
  const navigate = useNavigate();
  const roomId = useLoaderData() as string;

  useEffect(() => {
    if (state) {
      setIsLoading(state?.isLoading);
      if (state.isHost) {
        setIsCopyLinkOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    // Checking that socket connected and we have roomId from the URL
    if (socket && roomId) {
      // Anon user used room URL
      if (!roomInfo?.userName) {
        // check that room is not empty on the backend
        socket.emit(
          'checkRoom',
          { roomId },
          (response: { status: string; roomName: string; error?: string }) => {
            if (response && response.status === 'ok') {
              console.log('Room is not empty, ps', response);
              setIsLoading(false);
              setUserJoining(true);
              setRoomInfo({
                ...roomInfo,
                roomId: roomId,
              });
              setPokerSession({
                ...pokerSession,
                roomName: response.roomName,
              });
            }
            if (response && response.status === 'error') {
              // No such room exist - starting new session
              navigate(`/`, {
                state: {
                  message: "Room you were trying to access doesn't exist",
                },
              });
            }
          },
        );
      }
    }
  }, [socket, roomId]);
  return isLoading ? (
    <main className="flex-grow flex flex-col items-center justify-around ">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500 border-solid"></div>
    </main>
  ) : (
    <main className="flex-grow flex flex-col items-center justify-around">
      <CopyLink isOpen={isCopyLinkOpen} setShowToast={setShowToast} />
      <GetUsername isOpen={userJoining} roomId={roomId} />
      <div className="flex justify-around w-full flex-wrap">
        <DynamicParticipantList session={pokerSession} />
        <TopicNameBubble roomId={roomId} />
      </div>
      <div className="flex w-full justify-evenly flex-wrap">
        {pokerNumbers.map((rank) => (
          <div key={rank} className="flex justify-between m-2">
            <Card rank={rank} />
          </div>
        ))}
      </div>
      <Timer />
      <Toast
        message="URL is copied to clipboard"
        showToast={showToast}
        setShowToast={setShowToast}
      />
    </main>
  );
}
