import React from 'react';
import './index.css';
import { WebSocketProvider } from './context/WebSocketContext';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PokerProvider } from './context/PokerContext';
import StartPage from './Pages/StartPage';
import ErrorPage from './Pages/ErrorPage';
import AgilePokerPage, { loader as roomIdLoader } from './Pages/AgilePoker';
import Layout from './components/Layout';
import { v4 as uuidv4 } from 'uuid';

if (localStorage.getItem('clientUUID') === null) {
  localStorage.setItem('clientUUID', uuidv4());
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <StartPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/room/:roomId',
    element: (
      <Layout>
        <AgilePokerPage />
      </Layout>
    ),
    errorElement: <ErrorPage />,
    loader: roomIdLoader,
  },
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PokerProvider>
      <WebSocketProvider>
        <RouterProvider router={router} />
      </WebSocketProvider>
    </PokerProvider>
  </React.StrictMode>,
);
