import { useWebSocket } from "../context/WebSocketContext";
import { usePoker } from "../context/PokerContext";
import { useEffect, useMemo, useState } from "react";
import Tilt from "react-parallax-tilt";
import { CountdownState } from "../../../types";

const cardsBackgroundClasses = {
	"0": "bg-[url('/card-back-1.svg')]",
	"1": "bg-[url('/card-back-2.svg')]",
	"2": "bg-[url('/card-back-3.svg')]",
	"3": "bg-[url('/card-back-4.svg')]",
	"4": "bg-[url('/card-back-5.svg')]",
	"5": "bg-[url('/card-back-6.svg')]",
	"6": "bg-[url('/card-back-7.svg')]",
	"7": "bg-[url('/card-back-8.svg')]",
	"8": "bg-[url('/card-back-9.svg')]",
	"9": "bg-[url('/card-back-10.svg')]",
};

export type CardsKeys = keyof typeof cardsBackgroundClasses;

type GuestCardProps = {
	voteToRender: {
		votingProcess: string;
		isVoted: boolean;
		vote?: number;
	};
	cardBack: CardsKeys;
	className?: string;
	userName: string;
};

export const VoteResultCard = ({ voteToRender, className, userName, cardBack }: GuestCardProps) => {
	const cardSuits = [
		{ icon: "♠", color: "text-black" },
		{
			icon: "♥",
			color: "text-red-800",
		},
		{
			icon: "♦",
			color: "text-red-800",
		},
		{
			icon: "♣",
			color: "text-black",
		},
	];
	const [isFlipped, setFlipped] = useState(false);

	useEffect(() => {
		if (voteToRender.votingProcess === CountdownState.Finished) {
			setFlipped(true);
		} else {
			setFlipped(false);
		}
	}, [voteToRender]);

	const randomCardSuite = useMemo(() => cardSuits[Math.floor(Math.random() * cardSuits.length)], []);

	return (
		<div className={`text-center bg-transparent ${className} flex flex-col items-center`}>
			<Tilt>
				<div className={"w-[70px] h-[100px] bg-transparent"}>
					<div
						className={`relative w-full h-full text-center transform bg-transparent [transform-style:preserve-3d] ${
							isFlipped ? "[transform:rotateY(180deg)]" : ""
						} perspective-1000 transition-transform duration-500 `}
					>
						<div
							className={`backface-hidden rounded-lg text-black absolute w-full h-full ${cardsBackgroundClasses[cardBack]}`}
						/>
						<div className="backface-hidden rounded-lg border border-gray-800 absolute w-full h-full bg-gray-100 text-white [transform:rotateY(180deg)] flex flex-col px-1">
							<div className={`self-start text-lg ${randomCardSuite.color}`}>{randomCardSuite.icon}</div>
							<div className={`${randomCardSuite.color} grow flex items-center justify-center text-4xl`}>
								{voteToRender?.vote || "?"}
							</div>
							<div className={`${randomCardSuite.color}  text-lg self-end`}>{randomCardSuite.icon}</div>
						</div>
					</div>
				</div>
			</Tilt>
			<p className="pb-6 pt-1 font-semibold text-xl">{userName.toUpperCase()}</p>
		</div>
	);
};

export const UserCard = ({ rank }: { rank: number }) => {
	const { vote } = useWebSocket();
	const [{ roomInfo, selectedCard, clientUUID }, { setSelectedCard }] = usePoker();
	const cardSuits = [
		{ icon: "♠", color: "text-black" },
		{
			icon: "♥",
			color: "text-red-800",
		},
		{
			icon: "♦",
			color: "text-red-800",
		},
		{
			icon: "♣",
			color: "text-black",
		},
	];

	const randomCardSuite = useMemo(() => cardSuits[Math.floor(Math.random() * cardSuits.length)], []);
	return (
		<button
			onClick={() => {
				setSelectedCard(selectedCard === rank ? null : rank);
				vote(roomInfo.roomId, clientUUID ? clientUUID : "", selectedCard === rank ? -1 : rank);
			}}
			type="button"
			className="focus:outline-none rounded-lg"
		>
			<Tilt
				glareBorderRadius={"0.5rem"}
				tiltMaxAngleX={20}
				className={` border border-gray-800 w-[100px] h-[150px] relative transition-transform ease-in-out duration-300 text-white text-4xl font-bold transform  ${
					selectedCard === rank
						? "bg-green-400 translate-y-[-10%] shadow-card rounded-lg"
						: "translate-y-0 bg-slate-200 rounded-lg "
				}`}
				tiltMaxAngleY={20}
				glareEnable={true}
				glareMaxOpacity={0.8}
				scale={1.02}
			>
				<div className=" rounded-lg  w-full h-full text-white flex flex-col px-1 ">
					<div className={`self-start text-lg ${randomCardSuite.color}`}>{randomCardSuite.icon}</div>
					<div className={`${randomCardSuite.color} grow flex items-center justify-center text-4xl`}>{rank}</div>
					<div className={`${randomCardSuite.color}  text-lg self-end`}>{randomCardSuite.icon}</div>
				</div>
			</Tilt>
		</button>
	);
};
