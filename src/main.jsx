import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './App';
import { PerformanceProvider } from './context/PerformanceContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PerformanceProvider>
      <BrowserRouter>
        <App />
        <SpeedInsights />
      </BrowserRouter>
    </PerformanceProvider>
  </React.StrictMode>
);
