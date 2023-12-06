import * as React from 'react';
import ProfilePic from "../../ProfilePic/ProfilePic"
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import classes from './ChatWindow.module.css'
import { useSelector } from 'react-redux';
import { getUserName } from "../../../utils/GetChatName";
import { sendMessage, getIndividualChat, readMessageApiCall } from '../../../services/blabberApiHandler';
import NoChatSelected from '../UnselectedChatWindow/NoChatSelected';
import Message from '../Message/Message';
import { useDispatch } from "react-redux";
import { updateSnackBar } from '../../../store/SnackBarSlice';
import { updateAppLoader } from '../../../store/LoaderSlice';
import { useLocation } from 'react-router';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router';
import { useMediaQuery } from '@mui/material';
import { updateChatList } from '../../../store/ChatSlice';
import { getUserProfilePic } from '../../../utils/getUserProfilePoc';
import { io } from 'socket.io-client'

const ChatWindow = () => {
    const store = useSelector((state) => state)
    const isMobile = useMediaQuery('(max-width:768px)');
    const userId = localStorage.getItem('userId');
    const dispatch = useDispatch();
    const [enteredMessage, setEnteredMessage] = React.useState("")
    const [messageList, setMessageList] = React.useState([])
    const location = useLocation()
    const naviagte = useNavigate()
    const searchParams = new URLSearchParams(location?.search);
    const chatId = searchParams.get('chatId');
    const messagesEndRef = React.useRef(null)
    const [storedChat, setStoredChat] = React.useState({})
    const endpoint = "http://localhost:4000"
    const [connectedToSocket, setConnectedToSocket] = React.useState(false)
    const [socket, setSocket] = React.useState(null)

    React.useEffect(() => {
        fetchData(chatId)
    }, [location?.search])


    React.useEffect(() => {
        const newSocket = io(endpoint);
        setSocket(newSocket);

        newSocket.emit("appEntered", userId);
        newSocket.on("connected", () => setConnectedToSocket(true));

        return () => {
            newSocket.disconnect();
        };

    }, [])


    React.useEffect(() => {
        const storedChatString = localStorage.getItem('chatDetails');
        const parsedStoredChat = storedChatString ? JSON.parse(storedChatString) : null;
        setStoredChat(parsedStoredChat)
    }, [chatId]);

    React.useEffect(() => {
        if (storedChat?._id) {
            socket?.on("message received", (chat) => {

                if (chat?.chatId === storedChat?._id) {
                    setMessageList((prev) => [...prev, chat]);
                    scrollToBottom();
                }
                else {

                    dispatch(updateChatList({
                        chatList: [{
                            "_id": chat?.chatId,
                            "isGroupChat": chat?.isGroupChat,
                            "users": chat?.ArrowBackIosIconusers,
                            "profilePic": chat?.profilePic,
                            "createdAt": chat?.createdAt,
                            read: false,
                        }]
                    }))
                }
            });

            return () => {
                socket?.off("message received");
            };
        }

    }, [socket, storedChat]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const readMessage = async () => {
        try {
            const response = await readMessageApiCall(chatId)
            if (response?.data?.success) {
                socket?.emit("removeRead", chatId, userId)
            }
            else {
                dispatch(
                    updateSnackBar({
                        open: true,
                        severity: 'error',
                        message: 'Failed to update read status'
                    })
                )
            }
        }
        catch (error) {
            dispatch(
                updateSnackBar({
                    open: true,
                    severity: 'error',
                    message: 'Something went wrong'
                })
            )
        }
    }


    const fetchData = async (chatId) => {
        dispatch(
            updateAppLoader({
                loading: true
            })
        )
        if (chatId) {
            try {

                const response = await getIndividualChat(chatId)
                if (response?.data?.success) {
                    setMessageList(response?.data?.data);
                    readMessage()
                    socket?.emit('chatEntered', chatId);
                }
                else {
                    dispatch(
                        updateSnackBar({
                            open: true,
                            severity: 'error',
                            message: 'Failed to get chat'
                        })
                    )
                }

            }
            catch (error) {
                dispatch(
                    updateSnackBar({
                        open: true,
                        severity: 'error',
                        message: 'Something went wrong'
                    })
                )
            }
        }

        dispatch(
            updateAppLoader({
                loading: false
            })
        )
        scrollToBottom();
    }

    const handleBack = () => {
        dispatch(
            updateAppLoader({
                loading: true
            })
        )

        setTimeout(() => {
            naviagte('/chats')
            dispatch(
                updateAppLoader({
                    loading: false
                })
            )
        }, 1000);

    }

    const handleSendMessage = async () => {

        const payload = {
            sentBy: {
                _id: userId
            },
            message: enteredMessage,
            chatId: storedChat?._id,
            users: storedChat?.users,
            isGroupChat: storedChat?.isGroupChat
        }

        socket.emit("stopTyping", chatId)
        try {
            const response = await sendMessage(payload)
            if (response?.data?.success) {
                setMessageList(prev => [...prev, payload]);
                setEnteredMessage('')
                scrollToBottom()
                socket?.emit('newMessage', payload)
            }
            else {
                dispatch(
                    updateSnackBar({
                        open: true,
                        severity: 'error',
                        message: 'Failed to send message'
                    })
                )
            }
        }
        catch (error) {
            dispatch(
                updateSnackBar({
                    open: true,
                    severity: 'error',
                    message: 'Something went wrong'
                })
            )
        }

    }
    const changeHandler = (e) => {
        setEnteredMessage(() => e.target.value)

    }



    return (
        <div className={`${classes.container} ${!chatId ? classes.noDisplay : ''}`}>
            {chatId ?
                <>
                    <div style={{ height: '2rem', backgroundColor: '#496DDB', padding: '1rem', display: 'flex', alignItems: 'center', gap: 5, position: 'sticky' }}>
                        <ArrowBackIosIcon className={!isMobile ? classes.noBackButton : classes.backButton} onClick={handleBack} />
                        <ProfilePic src={!storedChat?.profilePic ? getUserProfilePic(storedChat?.users) : storedChat?.profilePic} />
                        <h3 style={{ color: '#fff' }}>{!storedChat?.isGroupChat ? getUserName(storedChat?.users) : storedChat?.chatName}</h3>

                    </div>
                    <div style={{ height: 'calc(100% - 8rem)', overflow: 'auto' }} >
                        {messageList.map((messages, index) => (
                            <div key={index}>
                                <Message
                                    content={messages.message}
                                    timeStamp={messages.timeStamp}
                                    sentBy={messages.sentBy}
                                    nextItem={messageList[index + 1]?.sentBy}
                                    isGroupChat={storedChat?.isGroupChat}
                                />
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div style={{ position: 'sticky', bottom: 0, right: 0, left: 0, height: '4rem' }} >
                        <TextField
                            id="outlined-start-adornment"
                            className={classes.typingSection}
                            value={enteredMessage}
                            placeholder="Share Your Blab!"
                            onChange={changeHandler}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && enteredMessage?.trim())
                                    handleSendMessage()
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" onClick={(e) => {
                                        if (enteredMessage?.trim())
                                            handleSendMessage(e)
                                    }}>
                                        <SendIcon className={enteredMessage.trim() ? classes.sendButton : classes.notAllowed} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                </> :
                <NoChatSelected />
            }
        </div>)
}

export default ChatWindow