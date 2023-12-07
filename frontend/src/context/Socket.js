import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client'; // or import WebSocket from 'websocket';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const endpoint = "https://blabber-backend.onrender.com/"
    const userId = localStorage.getItem('userId')

    useEffect(() => {
        const newSocket = io(endpoint);
        setSocket(newSocket);

        newSocket.emit("appEntered", userId);

        return () => {
            newSocket.disconnect();;
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
