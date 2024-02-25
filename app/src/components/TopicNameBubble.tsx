import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { usePoker } from "../context/PokerContext";
import { useWebSocket } from "../context/WebSocketContext";

export default function TopicNameBubble({ roomId }: { roomId: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const { pokerSession, roomInfo } = usePoker();
	const { updateRoomTopic } = useWebSocket();

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}

	type Topic = {
		topicName: string;
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
		setFocus,
	} = useForm<Topic>();

	const handleJoinSession: SubmitHandler<Topic> = (formData) => {
		updateRoomTopic(roomId, formData.topicName);
		closeModal();
	};

	useEffect(() => {
		setFocus("topicName");
	}, [setFocus]);

	return (
		<>
			<div className="my-4 relative min-w-[300px] max-w-[400px] max-h-[500px] p-4 bg-blue-200 text-black rounded-lg">
				<div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-200 rotate-45" />
				<div className="flex justify-between items-center mb-2">
					<h2 className="text-lg font-bold">Room's Topic:</h2>
					{roomInfo.isHost && (
						<div className="group">
							<div
								className="text-black hover:text-blue-500 transition-colors duration-200 cursor-pointer"
								onClick={openModal}
								onKeyUp={openModal}
							>
								<FileEditIcon />
							</div>
							<span className="hidden group-hover:block text-xs text-black absolute bg-white p-1 rounded-md -top-8 -right-4">
								Edit the topic
							</span>
						</div>
					)}
				</div>
				<p className=" text-xl break-all">{pokerSession.roomName}</p>
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
										<Dialog.Title
											as="h3"
											className="text-base text-center font-semibold leading-6 text-gray-900"
										>
											Enter new topic
										</Dialog.Title>
										<form
											onSubmit={handleSubmit(handleJoinSession)}
											className="my-8 flex gap-4 justify-center"
										>
											<div className="bg-white rounded-md flex-grow">
												<label htmlFor="email-address" className="sr-only">
													What is the next topic?
												</label>
												<input
													{...register("topicName", {
														required: "Enter new topic",
													})}
													className="w-full flex-auto bg-white/5 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-1 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
													placeholder="What is the next topic?"
												/>
												{errors.topicName && (
													<span>This field is required</span>
												)}
											</div>
											<button
												type="submit"
												className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 flex-grow-0"
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
		</>
	);
}

function FileEditIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" />
			<polyline points="14 2 14 8 20 8" />
			<path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
		</svg>
	);
}
