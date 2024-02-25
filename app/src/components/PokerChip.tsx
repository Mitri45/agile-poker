import "./poker-chip.css";

interface PokerChipProps {
	value: number;
}

const PokerChip = ({ value }: PokerChipProps) => {
	return (
		<div className={`chip ${value < 5 ? "red lastSeconds" : "black"}`}>
			<h3 className={`z-10 relative pb-2 ${value < 5 ? "lastSeconds" : ""}`}>{value}</h3>
		</div>
	);
};

export default PokerChip;
