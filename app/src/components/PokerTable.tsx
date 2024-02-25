import { useEffect, Fragment, useState } from "react";
import { usePoker } from "../context/PokerContext";
import { useWebSocket } from "../context/WebSocketContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";

const PokerTable = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [{ pokerSession, roomInfo }] = usePoker();
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
		reset,
		formState: { errors },
		setFocus,
	} = useForm<Topic>();

	const handleJoinSession: SubmitHandler<Topic> = (formData) => {
		updateRoomTopic(roomInfo.roomId, formData.topicName);
		// if (inputRef.current?.value) inputRef.current.value = "";
		reset();
		closeModal();
	};

	useEffect(() => {
		setFocus("topicName");
	}, [setFocus]);

	return (
		<div className="flex flex-col items-center justify-center bg-transparent">
			<div
				className="relative min-w-[600px] min-h-[350px] max-h-[600px] 
				max-w-[700px] bg-green-700 rounded-full border-8 border-gray-900 flex flex-col justify-center items-center after:w-3/4 
				after:h-2/3 after:border-2 after:border-yellow-500 after:absolute after:rounded-full"
			>
				<div className="flex justify-center w-3/4 h-2/3 gap-4 bg-green-800 rounded-full text-white items-center p-9 ">
					<p className="text-2xl relative font-semibold break-all">{pokerSession.roomName}</p>
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
															required: "Enter new topic",
														})}
														className="w-full flex-auto bg-white/5 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-1 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
														placeholder="What is the next topic?"
														// ref={inputRef}
													/>
													{errors.topicName && <span className="text-red-600">This field is required</span>}
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
				<button
					type="button"
					onClick={openModal}
					onKeyUp={openModal}
					className="absolute bottom-3 w-[140px] px-3 h-[30px] text-sm font-medium rounded-md text-white bg-gray-800 hover:shadow-xl transition-all"
				>
					Change topic
				</button>
			</div>
		</div>
	);
};

export default PokerTable;
