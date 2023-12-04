import { useLocation, useNavigate } from 'react-router-dom';
import { usePoker } from '../context/PokerContext';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useWebSocket } from '../context/WebSocketContext';

export default function GetUsername() {
  const { roomInfo, setRoomInfo } = usePoker();
  const { connectToTheRoom } = useWebSocket();

  type GetUsernameInput = {
    userName: string;
  };
  const navigate = useNavigate();
  let location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GetUsernameInput>();

  const handleJoinSession: SubmitHandler<GetUsernameInput> = async (
    formData,
  ) => {
    setRoomInfo({ ...roomInfo, userName: formData.userName });
    connectToTheRoom(location.state.roomId, formData.userName);
    navigate(`/room/${location.state.roomId}`);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-xl lg:max-w-lg bg-gray-100 rounded-md shadow-lg  p-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          You are joining room {location.state.roomName}
        </h2>
        <form
          onSubmit={handleSubmit(handleJoinSession)}
          className="mt-8 flex flex-col max-w-md gap-x-4"
        >
          <div className="mb-5 bg-white rounded-md ">
            <label htmlFor="email-address" className="sr-only">
              Your Name
            </label>
            <input
              {...register('userName', { required: true })}
              id="userName"
              name="userName"
              type="text"
              autoComplete="off"
              required
              className="w-full flex-auto border-0 bg-white/5 px-3.5 py-2  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              placeholder="Enter your name"
            />
            {errors.userName && <span>This field is required</span>}
          </div>
          <button
            type="submit"
            className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold  shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Join Agile Poker
          </button>
        </form>
      </div>
    </div>
  );
}
