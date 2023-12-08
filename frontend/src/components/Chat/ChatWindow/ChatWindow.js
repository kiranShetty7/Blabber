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
import { updateChat, updateChatList } from '../../../store/ChatSlice';
import { getUserProfilePic } from '../../../utils/getUserProfilePoc';
import { useSocket } from '../../../context/Socket';

const ChatWindow = () => {
    const store = useSelector((state) => state)
    const chatState = store.chat
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
    const socket = useSocket()

    React.useEffect(() => {
        fetchData(chatId)
    }, [location?.search])


    React.useEffect(() => {
        const storedChatString = localStorage.getItem('chatDetails');
        const parsedStoredChat = storedChatString ? JSON.parse(storedChatString) : null;
        setStoredChat(parsedStoredChat)
    }, [chatId]);

    React.useEffect(() => {
        console.log(chatState?.newMessage)
                    setMessageList((prev) => [...prev, chatState?.newMessage]);
                    scrollToBottom();
                

    }, [chatState?.newMessage]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const readMessage = async () => {
        try {
            const response = await readMessageApiCall(chatId)
            if (response?.data?.success) {
                dispatch(updateChat({
                    chatIdToBeUpdated: chatId
                }))
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
            localStorage.removeItem('chatDetails')
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
                    <div className={classes.header}>
                        <ArrowBackIosIcon className={!isMobile ? classes.noBackButton : classes.backButton} onClick={handleBack} />
                        <ProfilePic src={!storedChat?.profilePic ? getUserProfilePic(storedChat?.users) : storedChat?.profilePic} />
                        <h3 className={classes.chatName}>{!storedChat?.isGroupChat ? getUserName(storedChat?.users) : storedChat?.chatName}</h3>

                    </div>
                    <div className={classes.messageList} >
                        {messageList.map((messages, index) => (
                            <div key={index}>
                                <Message
                                    content={messages?.message}
                                    timeStamp={messages?.createdAt}
                                    sentBy={messages?.sentBy}
                                    nextItem={messageList[index + 1]?.sentBy}
                                    isGroupChat={storedChat?.isGroupChat}
                                />
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div  className={classes.sendMessage}>
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