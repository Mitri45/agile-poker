import { useLocation, useNavigate } from 'react-router-dom';
import { usePoker } from '../context/PokerContext';
import Toast from '../components/Toast';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CountdownState } from '../../../types';
import { useWebSocket } from '../context/WebSocketContext';

type StartPageInputs = {
  roomName: string;
  userName: string;
};

export default function StartPage() {
  const { createRoom } = useWebSocket();
  const { setRoomInfo } = usePoker();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StartPageInputs>();
  let { state } = useLocation();
  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (state && state.message) {
      setMessage(state.message);
      setShowToast(true);
    }
  }, []);

  const handlePrepareSession: SubmitHandler<StartPageInputs> = async (
    formData,
  ) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}/getRoomID`,
        {
          roomName: formData.roomName,
          userName: formData.userName,
        },
      );
      const roomInfo = {
        userName: formData.userName,
        roomId: data.roomId,
        countdownState: CountdownState.Stopped,
        isHost: true,
      };
      setRoomInfo(roomInfo);
      createRoom(data.roomId, formData.userName, formData.roomName);
      navigate(`/room/${data.roomId}`, {
        state: { isLoading: false, isHost: true },
      });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-xl lg:max-w-lg bg-gray-100 rounded-md shadow-lg  p-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Agile Poker Start Page
        </h2>
        <form
          onSubmit={handleSubmit(handlePrepareSession)}
          className="mt-8 flex flex-col max-w-md gap-x-4"
        >
          <div className="mb-5 bg-white rounded-md ">
            <label htmlFor="email-address" className="sr-only">
              Room name
            </label>
            <input
              {...register('roomName', { required: true })}
              id="roomName"
              name="roomName"
              type="text"
              autoComplete="off"
              required
              className=" border-0 w-full bg-white/5 px-3.5 py-2  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              placeholder="What topic we are discussing?"
            />
            {errors.roomName && <span>This field is required</span>}
          </div>
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
            Start Agile Poker
          </button>
        </form>
      </div>
      <Toast
        message={message}
        showToast={showToast}
        setShowToast={setShowToast}
      />
    </div>
  );
}
