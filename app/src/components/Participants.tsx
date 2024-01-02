import { CountdownState } from '../../../types';
import { usePoker } from '../context/PokerContext';
import { SessionType } from '../types';

const DynamicParticipantList = ({ session }: { session: SessionType }) => {
  const { countdownState } = usePoker();

  const votingProcessToRender = (user: string) => {
    switch (countdownState) {
      case CountdownState.Stopped:
        return 'Voting not started';
      case CountdownState.Started:
        return 'Voting in process';
      case CountdownState.Finished:
        return session.votes[user] === -1
          ? 'Not Voted Yet'
          : session.votes[user];
      default:
        return 'Voting in process';
    }
  };
  return (
    <div className="flex-1 max-w-[600px] p-6 bg-white border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Participant List</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left py-2">#</th>
            <th className="text-left py-2">Name</th>
            <th className="text-left py-2">Chosen Number</th>
          </tr>
        </thead>
        <tbody>
          {session.participants.map((participant, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">{index + 1}</td>
              <td className="py-2">{participant}</td>
              <td className="py-2">{votingProcessToRender(participant)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicParticipantList;
