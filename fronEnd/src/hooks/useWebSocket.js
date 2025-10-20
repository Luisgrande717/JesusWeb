import { useEffect, useRef, useState } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';

export const useWebSocket = (token) => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    if (!token) return;

    // Create WebSocket connection
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);

      // Authenticate
      ws.current.send(JSON.stringify({
        type: 'auth',
        token
      }));
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch (err) {
        console.error('WebSocket message parse error:', err);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [token]);

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { connected, messages, sendMessage };
};
