import { CountdownState, SessionType } from "../../../types";
import { usePoker } from "../context/PokerContext";
import { CardsKeys, VoteResultCard } from "./Card";

const Participants = ({ session }: { session: SessionType }) => {
	const [{ countdownState }] = usePoker();

	const votingProcessToRender = (clientUUID: string) => {
		switch (countdownState) {
			case CountdownState.Stopped:
				return { votingProcess: CountdownState.Stopped, isVoted: false };
			case CountdownState.Started:
				return { votingProcess: CountdownState.Started, isVoted: false };
			case CountdownState.Finished:
				return session.participants.get(clientUUID)?.vote === -1 || !session.participants.get(clientUUID)?.vote
					? { votingProcess: CountdownState.Finished, isVoted: false }
					: {
							votingProcess: CountdownState.Finished,
							isVoted: true,
							vote: session.participants.get(clientUUID)?.vote,
					  };
			default:
				return { votingProcess: CountdownState.Stopped, isVoted: false };
		}
	};

	return (
		<div className="flex gap-4 lg:gap-8 justify-center">
			{[...session.participants.entries()].map(([key, value]) => (
				<VoteResultCard
					key={key}
					userName={value.userName}
					cardBack={value.cardBackNumber as CardsKeys}
					voteToRender={votingProcessToRender(key)}
				/>
			))}
		</div>
	);
};

export default Participants;
