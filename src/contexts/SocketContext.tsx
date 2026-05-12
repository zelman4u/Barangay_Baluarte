import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  messages: any[];
  broadcastMessage: (message: string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  messages: [],
  broadcastMessage: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // In production, the socket should point to the same origin
    const newSocket = io(window.location.origin);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('message_received', (data) => {
      setMessages((prev) => [data, ...prev].slice(0, 50));
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const broadcastMessage = (message: string) => {
    if (socket) {
      socket.emit('broadcast_message', { text: message });
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, messages, broadcastMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
