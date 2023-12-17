import React from 'react';
import ReactDOM from 'react-dom/client';
import { UserDataProvider } from './contexts/UserDataContext';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserDataProvider>
      <App />
    </UserDataProvider>
  </React.StrictMode>
);
