import React from 'react';
import './styles/index.css';
import App from './App';
import { WebSocketProvider } from './context/WebSocketContext';
import { createRoot } from 'react-dom/client';

// render react app with createRoot
createRoot(document.getElementById('root')!).render(
<React.StrictMode>
    <WebSocketProvider>
      <App />
    </WebSocketProvider>
  </React.StrictMode>
);

