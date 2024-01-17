import { CountdownState, SessionType } from '../../../types';
import { usePoker } from '../context/PokerContext';

const DynamicParticipantList = ({ session }: { session: SessionType }) => {
  const { countdownState } = usePoker();
  const votingProcessToRender = (clientUUID: string) => {
    switch (countdownState) {
      case CountdownState.Stopped:
        return 'Start countdown for voting';
      case CountdownState.Started:
        return 'Voting in process';
      case CountdownState.Finished:
        return session.votes.get(clientUUID) === -1 ||
          !session.votes.get(clientUUID)
          ? 'Not Voted Yet'
          : session.votes.get(clientUUID);
      default:
        return 'Voting in process';
    }
  };

  return (
    <div className="my-2 flex-1 max-w-[600px] p-6 mx-10 bg-white border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Participants List</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left py-2">#</th>
            <th className="text-left py-2">Name</th>
            <th className="text-left py-2">Chosen Number</th>
          </tr>
        </thead>
        <tbody>
          {[...session.participants.entries()].map(([key, value], index) => (
            <tr key={index} className="border-b">
              <td className="py-2">{index + 1}</td>
              <td className="py-2">
                {value}
                {key === session.host && (
                  <span className="ml-1 text-xs">(host)</span>
                )}
              </td>
              <td className="py-2">{votingProcessToRender(key)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicParticipantList;
