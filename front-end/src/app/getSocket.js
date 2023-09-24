import { io } from 'socket.io-client';

let socket;
export default function getSocket(token) {
    if (!socket) {
        socket = io(process.env.REACT_APP_BACKEND_URL, { auth: { token: `Bearer ${token}` } });
    }
    return socket;
}
