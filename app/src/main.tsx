import React from 'react';
import './index.css';
import { WebSocketProvider } from './context/WebSocketContext';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PokerProvider } from './context/PokerContext';
import StartPage from './Pages/StartPage';
import ErrorPage from './Pages/ErrorPage';
import AgilePokerPage, { loader as roomIdLoader } from './Pages/AgilePoker';
import GetUsername from './Pages/GetUsername';

const router = createBrowserRouter([
  {
    path: '/',
    element: <StartPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'room/:roomId',
    element: (
      <WebSocketProvider>
        <AgilePokerPage />
      </WebSocketProvider>
    ),
    errorElement: <ErrorPage />,
    loader: roomIdLoader,
  },
  {
    path: 'welcome',
    element: (
      <WebSocketProvider>
        <GetUsername />
      </WebSocketProvider>
    ),
    errorElement: <ErrorPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PokerProvider>
      <RouterProvider router={router} />
    </PokerProvider>
  </React.StrictMode>,
);
