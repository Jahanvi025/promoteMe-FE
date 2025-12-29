import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { RootState, useAppDispatch, useAppSelector } from '../store/store';
import { setMessageCount } from '../store/reducers/authReducer';
// import { useAppSelector } from '../store/store';

const ENDPOINT = import.meta.env.VITE_APP_SOCKET_BASE_URL;

export default function useSocket(selectedChatId: string, userId: string, refetch: () => void, setMessages: React.Dispatch<React.SetStateAction<MessageResponse>>) {
    const [socket, setSocket] = useState<Socket | null>(null);
    //   const [socketConnected, setSocketConnected] = useState<boolean>(false);
    const [selectedChatCompare, setSelectedChatCompare] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const unseenMessages = useAppSelector(
        (state: RootState) => state.auth?.messageCount
    );

    useEffect(() => {
        const newSocket = io(ENDPOINT, {
            // transports: ['polling'],
            path: '/marketplace-socket/api/socket',
        });
        setSocket(newSocket);
        newSocket.emit('setup', userId);
        // newSocket.on('connection', () => setSocketConnected(true));

        return () => {
            newSocket.disconnect();
            setSocket(null);
        };
    }, [userId]);

    useEffect(() => {
        if (selectedChatId && userId) {
            socket?.emit('view conversation', {
                conversationId: selectedChatId,
                userId,
            });

            return () => {
                socket?.off('unseen message count');
            };
        }
    }, [selectedChatId, userId]);

    useEffect(() => {
        const handleNewMessage = (newMessageReceived: Message) => {
            if (!selectedChatCompare || selectedChatCompare !== newMessageReceived.conversation_id) {
                refetch();
                dispatch(
                    setMessageCount({ count: unseenMessages + 1 })
                );
            } else {
                socket?.emit('view conversation', {
                    conversationId: selectedChatId,
                    userId,
                });
                setMessages(prevMessages => ({
                    data: {
                        messages: [...prevMessages.data.messages, newMessageReceived],
                        count: prevMessages.data.count + 1,
                    },
                }));
            }
        };

        socket?.on('message received', handleNewMessage);

        return () => {
            socket?.off('message received', handleNewMessage);
        };
    }, [socket, selectedChatCompare, refetch]);

    return { socket, setSelectedChatCompare };
}
