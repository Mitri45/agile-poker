import { usePoker } from "../context/PokerContext";
import { useWebSocket } from "../context/WebSocketContext";

const PokerTable = () => {
	const [{ pokerSession }] = usePoker();

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
			</div>
		</div>
	);
};

export default PokerTable;
