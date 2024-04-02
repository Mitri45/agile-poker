import { useState, useEffect, Fragment } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import { usePoker } from "../context/PokerContext";
import { CountdownState } from "../../../types";
import PokerChip from "./PokerChip";
import { Dialog, Transition } from "@headlessui/react";
import { SubmitHandler, useForm } from "react-hook-form";

const CountdownTimer = ({ showToastMessage }: { showToastMessage: (message: string) => void }) => {
	const { socket } = useWebSocket();
	const countdownDuration = 10;
	const { updateRoomTopic } = useWebSocket();

	const [countdown, setCountdown] = useState(countdownDuration);
	const [{ roomInfo, countdownState }, { setCountdownState, setSelectedCard }] = usePoker();
	const [isActive, setIsActive] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
		setFocus("topicName");
	}

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

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		setFocus,
	} = useForm<{ topicName: string }>();

	const handleJoinSession: SubmitHandler<{ topicName: string }> = (formData) => {
		updateRoomTopic(roomInfo.roomId, formData.topicName);
		reset();
		closeModal();
	};

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
			<div className="flex flex-col items-center justify-center gap-4">
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
				<button
					type="button"
					onClick={openModal}
					onKeyUp={openModal}
					className="w-[140px] px-3 h-[30px] text-sm font-medium rounded-md text-white bg-gray-600 hover:shadow-xl transition-all"
				>
					Change topic
				</button>
			</div>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={closeModal}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black/25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
									<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
										<Dialog.Title as="h3" className="text-base text-center font-semibold leading-6 text-gray-900">
											Enter new topic
										</Dialog.Title>
										<form onSubmit={handleSubmit(handleJoinSession)} className="my-8 flex gap-4 justify-center">
											<div className="bg-white rounded-md flex-grow">
												<label htmlFor="email-address" className="sr-only">
													What is the next topic?
												</label>
												<input
													{...register("topicName", {
														required: "You need to provide a topic name",
														maxLength: { value: 50, message: "Topic name is too long,max is 50 characters" },
													})}
													className="w-full flex-auto bg-white/5 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-1 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
													placeholder="What is the next topic?"
													// ref={inputRef}
												/>
												{errors.topicName && <span className="text-red-600">{errors.topicName.message}</span>}
											</div>
											<button
												type="submit"
												className="flex-none max-h-[40px] rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 flex-grow-0"
											>
												Change topic
											</button>
										</form>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
};

export default CountdownTimer;
