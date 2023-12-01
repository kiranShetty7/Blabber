import * as React from 'react';
import ProfilePic from "../../ProfilePic/ProfilePic"
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import classes from './ChatWindow.module.css'
import { useSelector } from 'react-redux';
import { getUserName } from "../../../utils/GetChatName";
import { sendMessage, getIndividualChat } from '../../../services/blabberApiHandler';
import NoChatSelected from '../UnselectedChatWindow/NoChatSelected';
import Message from '../Message/Message';
import { useDispatch } from "react-redux";
import { updateSnackBar } from '../../../store/SnackBarSlice';
import { updateAppLoader } from '../../../store/LoaderSlice';
import { useLocation } from 'react-router';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router';
import { useMediaQuery } from '@mui/material';


const ChatWindow = () => {
    const store = useSelector((state) => state)
    const isMobile = useMediaQuery('(max-width:768px)');
    const chatState = store.chat
    const socketState = store.socket
    const userId = localStorage.getItem('userId');
    const dispatch = useDispatch();
    const [selectedChat, setSelectedChat] = React.useState('')
    const [chatList, setChatList] = React.useState([])
    const [isGroupChat, setIsGroupChat] = React.useState(false)
    const [enteredMessage, setEnteredMessage] = React.useState("")
    const [messageList, setMessageList] = React.useState([])
    const location = useLocation()
    const naviagte = useNavigate()
    const searchParams = new URLSearchParams(location?.search);
    const chatId = searchParams.get('chatId');
    const messagesEndRef = React.useRef(null)
    const [socket, setSocket] = React.useState(null)
 

    React.useEffect(() => {
        setChatList(chatState.selectedChatDetails?.users)
        setIsGroupChat(chatState.selectedChatDetails?.isGroupChat)
        setSelectedChat(chatState?.selectedChatDetails)
        fetchData(chatId)
        console.log(location?.search)
        console.log(chatId)
    }, [chatState.selectedChatDetails])


    React.useEffect(()=>{
        setSocket(socketState?.socket)
    },[socketState?.socket])

    // React.useEffect(()=>{
    //     socket?.on(,(chat)=>{
    //         console.log(chat)
    //         console.log(chat?.message)
        
    //         console.log(selectedChat)
    //         if(chat?.chatid === selectedChat?._id){
    //             setMessageList(prev => [...prev, chat]);
    //             scrollToBottom()
    //         }
    //     })
    // },[socket])

    React.useEffect(() => {
        socket?.on("message received", (chat) => {
            console.log(chat)
            console.log(chat?.message)
        
            console.log(selectedChat)
            if(chat?.chatId === selectedChat?._id){
                setMessageList(prev => [...prev, chat]);
                scrollToBottom()
            }
        });
      
        return () => {
          socket?.off("message received");
        };
      }, [socket]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };


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
                console.log(error)
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
            sentBy: userId,
            message: enteredMessage,
            chatId: selectedChat?._id,
            users:selectedChat?.users,
            isGroupChat:selectedChat?.isGroupChat
        }

        try {
            const response = await sendMessage(payload)
            if (response?.data?.success) {
                setMessageList(prev => [...prev, payload]);
                setEnteredMessage('')
                scrollToBottom()
                socket.emit('newMessage',payload)
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
    return (
        <div className={`${classes.container} ${!chatId ? classes.noDisplay : ''}`}>
            {chatId ?
                <>
                    <div style={{ height: '2rem', backgroundColor: '#496DDB', padding: '1rem', display: 'flex', alignItems: 'center', gap: 5, position: 'sticky' }}>
                        <ArrowBackIosIcon className={!isMobile ? classes.noBackButton : classes.backButton} onClick={handleBack} />
                        <ProfilePic src={chatState.profilePic} />
                        <h3 style={{ color: '#fff' }}>{!isGroupChat ? getUserName(chatList) : chatState.selectedChatDetails.chatName}</h3>

                    </div>
                    <div style={{ height: 'calc(100% - 8rem)', overflow: 'auto' }} >
                        {messageList.map((messages, index) => (
                            <div >
                                <Message
                                    content={messages.message}
                                    timeStamp={messages.timeStamp}
                                    sentBy={messages.sentBy}
                                    nextItem={messageList[index + 1]?.sentBy}
                                    isGroupChat={isGroupChat}
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
                            onChange={(e) => setEnteredMessage(() => e.target.value)}
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