import { usePoker } from "../context/PokerContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { useWebSocket } from "../context/WebSocketContext";
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import logo from "../assets/agile-poker-logo.jpeg";

export default function GetUsername({
	isOpen,
	roomId,
}: {
	isOpen: boolean;
	roomId: string;
}) {
	const [open, setOpen] = useState(isOpen);
	const nameInput = useRef(null);
	const [{ pokerSession, clientUUID }, { setRoomInfoAttribute }] = usePoker();
	const { connectToTheRoom } = useWebSocket();

	type GetUsernameInput = {
		userName: string;
	};
	const {
		register,
		handleSubmit,
		formState: { errors },
		setFocus,
	} = useForm<GetUsernameInput>();

	const handleJoinSession: SubmitHandler<GetUsernameInput> = (formData) => {
		setRoomInfoAttribute({
			userName: formData.userName,
			roomId: roomId,
		});
		connectToTheRoom(roomId, formData.userName, clientUUID ? clientUUID : "");
		setOpen(false);
	};

	useEffect(() => {
		setFocus("userName");
	}, [setFocus]);
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog static as="div" className="relative z-10" initialFocus={nameInput} onClose={() => null}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
								<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
									<img src={logo} alt="Agile Poker Logo" className="rounded-md mb-3 max-w-sm m-auto" />
									<Dialog.Title as="h3" className="text-lg text-center font-semibold leading-6 text-gray-900">
										Welcome to Agile Poker. <br />
										Please enter your name to discuss "{pokerSession.roomName}" topic.
									</Dialog.Title>
									<form onSubmit={handleSubmit(handleJoinSession)} className="my-8 flex gap-4 justify-center">
										<div className="bg-white rounded-md flex-grow">
											<label htmlFor="email-address" className="sr-only">
												What is your name?
											</label>
											<input
												{...register("userName", {
													required: "Please enter your name",
													maxLength: {
														value: 20,
														message: "Please enter a name with fewer than 20 characters",
													},
												})}
												// ref={nameInput}
												className="w-full flex-auto bg-white/5 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-1 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
												placeholder="What is your name?"
											/>
											{errors.userName && <span>{errors.userName.message}</span>}
										</div>
										<button
											type="submit"
											className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 flex-grow-0"
										>
											Join Agile Poker
										</button>
									</form>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
