import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useWebSockets({ onNewAlert, onAlertUpdated }) {
  const socketRef = useRef(null);

  useEffect(() => {
    // The backend URL is typically REACT_APP_API_URL without the /api path
    const backendUrl = process.env.REACT_APP_API_URL 
      ? process.env.REACT_APP_API_URL.replace('/api', '')
      : 'http://localhost:5000';
      
    socketRef.current = io(backendUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
    });

    socketRef.current.on('connect', () => {
      console.log('🔗 WebSocket Connected:', socketRef.current.id);
    });

    socketRef.current.on('newAlert', (alert) => {
      if (onNewAlert) onNewAlert(alert);
    });

    socketRef.current.on('alertUpdated', (alert) => {
      if (onAlertUpdated) onAlertUpdated(alert);
    });

    socketRef.current.on('disconnect', () => {
      console.log('🔗 WebSocket Disconnected');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [onNewAlert, onAlertUpdated]);

  return socketRef.current;
}
