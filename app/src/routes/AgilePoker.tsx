import { useEffect, useState } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { usePoker } from "../context/PokerContext";
import { UserCard } from "../components/Card";
import Timer from "../components/Timer";
import DynamicParticipantList from "../components/Participants";
import GetUsername from "../components/GetUsername";
import CopyLink from "../components/CopyLink";
import Toast from "../components/Toast";
import Header from "../components/Header";
import PokerTable from "../components/PokerTable";

const pokerNumbers = [1, 2, 3, 5, 8, 13];

export default function AgilePokerPage() {
	const [userJoining, setUserJoining] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isCopyLinkOpen, setIsCopyLinkOpen] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");

	const { state } = useLocation();
	const { socket } = useWebSocket();
	const [{ pokerSession }, { setRoomName, setRoomInfoAttribute }] = usePoker();
	const navigate = useNavigate();
	const { roomId } = useLoaderData() as { roomId: string };
	const showToastMessage = (message: string) => {
		setToastMessage(message);
		setShowToast(true);
	};
	useEffect(() => {
		// Checking that socket connected and we have roomId from the URL
		if (!socket || !roomId) return;
		// Anon user used room URL
		socket.emit("checkRoom", { roomId }, (response: { status: string; roomName: string; error?: string }) => {
			if (response && response.status === "ok") {
				if (state?.isHost !== undefined && state.isHost) {
					if (state?.isLoading !== undefined) setIsLoading(state.isLoading);
					setIsCopyLinkOpen(true);
				} else {
					// check that room is not empty on the backend
					setIsLoading(false);
					setUserJoining(true);
					setRoomInfoAttribute({
						roomId: roomId,
					});
					setRoomName(response.roomName);
				}
			}
			if (response && response.status === "error") {
				// No such room exist - starting new session
				navigate("/", {
					state: {
						message: "Room you were trying to access doesn't exist",
					},
				});
			}
		});
	}, [socket, roomId, state, navigate, setRoomInfoAttribute, setRoomName]);

	useEffect(() => {
		if (!socket) return;
		socket.on("announcement", (data: string) => {
			showToastMessage(data);
		});
	}, [socket, showToastMessage]);

	return isLoading ? (
		<main className="max-h-screen flex-grow flex flex-col items-center justify-around ">
			<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500 border-solid" />
		</main>
	) : (
		<div className="max-h-screen flex flex-col h-screen p-5">
			<Header />
			<main className="flex-grow flex flex-col items-center justify-around">
				<CopyLink isOpen={isCopyLinkOpen} showToastMessage={showToastMessage} />
				<GetUsername isOpen={userJoining} roomId={roomId} />
				<DynamicParticipantList session={pokerSession} />
				<div className="flex justify-center gap-24 w-full">
					<PokerTable />
					<Timer showToastMessage={showToastMessage} />
				</div>
				<div className="grid sm:grid-cols-3 gap-y-6 grid-flow-col auto-cols-max gap-x-9">
					{pokerNumbers.map((rank) => (
						<UserCard key={rank} rank={rank} />
					))}
				</div>
				<Toast message={toastMessage} showToast={showToast} setShowToast={setShowToast} />
			</main>
		</div>
	);
}
