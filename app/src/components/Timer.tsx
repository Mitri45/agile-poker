import { useState, useEffect } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import { usePoker } from "../context/PokerContext";
import { CountdownState } from "../../../types";
import PokerChip from "./PokerChip";

const CountdownTimer = ({ showToastMessage }: { showToastMessage: (message: string) => void }) => {
	const { socket } = useWebSocket();
	const countdownDuration = 10;
	const [countdown, setCountdown] = useState(countdownDuration);
	const [{ roomInfo, countdownState }, { setCountdownState, setSelectedCard }] = usePoker();
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		if (socket) {
			socket.on("startCountdown", () => {
				setCountdown(countdownDuration);
				setSelectedCard(null);
				setCountdownState(CountdownState.Started);
				showToastMessage("Voting has started");
			});
			socket.on("countdown", (value: number) => {
				setCountdown(value);
				if (value === 0) {
					setIsActive(false);
					setCountdownState(CountdownState.Finished);
				}
			});
		}
	}, [socket, setSelectedCard, setCountdownState, showToastMessage]);

	const startCountdown = () => {
		setIsActive(true);
		if (socket) {
			socket.emit("startCountdown", {
				roomId: roomInfo.roomId,
				countdownDuration,
			});
		}
	};

	return (
		<div className="p-4 bg-white flex flex-col items-center rounded-lg w-full max-w-[370px]">
			{!roomInfo.isHost ? (
				<h2 className="text-2xl font-bold text-center mb-4 ">
					{countdownState === CountdownState.Started ? "Voting in process" : "Host will start the countdown"}
				</h2>
			) : (
				<h2 className="text-2xl font-bold text-center mb-4 ">
					{countdownState === CountdownState.Started ? "Voting in process" : "Start the countdown"}
				</h2>
			)}
			<div className="flex items-center justify-center mb-8">
				<PokerChip value={countdown} />
			</div>
			{roomInfo.isHost && (
				<button
					onClick={startCountdown}
					disabled={isActive}
					type="button"
					className="w-full px-4 border border-transparent h-[50px] text-sm font-medium rounded-md text-white bg-green-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 max-w-[150px] disabled:bg-slate-400 disabled:hover:shadow-none transition-all "
				>
					{isActive ? "VOTING IN PROGRESS" : "VOTE NOW"}
				</button>
			)}
		</div>
	);
};

export default CountdownTimer;
