import { io, Socket } from "socket.io-client";
import ChatListener from "./chat_listener";

export default class ChatService {

    private socket: Socket;
    private listeners: ChatListener[] = [];

    constructor() {
        const serverHost: string = process.env.CHAT_HOST || 'http://localhost';
        this.socket = io(serverHost);
    }

    registerListener(listener: ChatListener) {
        this.listeners.push(listener)
    }

    registerUser(username: string): void {
        this.socket.emit('add user', username);
    }

    sendMesage(message: string): void {
        // TODO in the future we want to specify to which channel the message will be sent
        this.socket.emit('new message', message);
    }

    listenToNewMessages(): void {
        this.socket.on('new message', (data: any) => {
            // TODO some possible validations, prevent code injections!
            for (let listener of this.listeners) {
                listener.onMessage(data);
            }
        });
    }
}
