// src/components/SocketInitializer.tsx
import { useEffect } from 'react';
import { getSocket } from '@/socket';

export const SocketInitializer = () => {
  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });

    // ❌ KHÔNG cần disconnect ở đây nếu không chắc chắn!
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  return null;
};
