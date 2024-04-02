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
		if (state?.isHost !== undefined && state.isHost) {
			if (state?.isLoading !== undefined) setIsLoading(state.isLoading);
			setIsCopyLinkOpen(true);
		} else {
			// check that room is not empty on the backend
			socket.emit("checkRoom", { roomId }, (response: { status: string; roomName: string; error?: string }) => {
				if (response && response.status === "ok") {
					setIsLoading(false);
					setUserJoining(true);
					setRoomInfoAttribute({
						roomId: roomId,
					});
					setRoomName(response.roomName);
				} else if (response && response.status === "error") {
					// No such room exist - starting new session
					navigate("/", {
						state: {
							message: "Room you were trying to access doesn't exist",
						},
					});
				}
				return;
			});
		}
		socket.on("announcement", (data: string) => {
			showToastMessage(data);
		});
	}, [socket, roomId, state, navigate, setRoomInfoAttribute, showToastMessage, setRoomName]);

	return isLoading ? (
		<main className="flex-grow flex flex-col items-center justify-around ">
			<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500 border-solid" />
		</main>
	) : (
		<div className="flex flex-col h-screen p-5">
			<Header />
			<main className="flex-grow flex flex-col items-center justify-around">
				<CopyLink isOpen={isCopyLinkOpen} showToastMessage={showToastMessage} />
				<GetUsername isOpen={userJoining} roomId={roomId} />
				<div className="flex flex-col">
					<DynamicParticipantList session={pokerSession} />
					<PokerTable />
				</div>

				<div className="flex px-4 min-h-[400px] justify-around lg:justify-between items-center w-full max-w-[1200px]">
					<Timer showToastMessage={showToastMessage} />
					<div className="flex w-1/2 lg:w-full justify-evenly flex-wrap max-w-[1000px]">
						<div className="grid grid-cols-3 gap-y-6 xl:grid-flow-col xl:auto-cols-max gap-4">
							{pokerNumbers.map((rank) => (
								<UserCard key={rank} rank={rank} />
							))}
						</div>
					</div>
				</div>
				<Toast message={toastMessage} showToast={showToast} setShowToast={setShowToast} />
			</main>
		</div>
	);
}
