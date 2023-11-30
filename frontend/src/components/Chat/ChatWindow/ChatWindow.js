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

const ChatWindow = () => {

    const store = useSelector((state) => state)
    const chatState = store.chat
    const userId = localStorage.getItem('userId');
    const dispatch = useDispatch();
    const [selectedChatId, setSelectedChatId] = React.useState('')
    const [chatList, setChatList] = React.useState([])
    const [isGroupChat, setIsGroupChat] = React.useState(false)
    const [enteredMessage, setEnteredMessage] = React.useState("")
    const [messageList, setMessageList] = React.useState([])
    const location = useLocation()
    console.log(location)
    const searchParams = new URLSearchParams(location?.search);
    const chatId = searchParams.get('chatId');
    const messagesEndRef = React.useRef(null)

    React.useEffect(() => {
        setChatList(chatState.selectedChatDetails?.users)
        setIsGroupChat(chatState.selectedChatDetails?.isGroupChat)
        setSelectedChatId(chatState?.selectedChatDetails._id)
        fetchData(chatId)
    }, [chatState.selectedChatDetails])

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
          if(chatId){
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

        dispatch(
            updateAppLoader({
              loading: false
            })
          )
          scrollToBottom(); 
    }



    const handleSendMessage = async () => {

        const payload = {
            sentBy: userId,
            message: enteredMessage,
            chatId: selectedChatId,
        }

        try {
            const response = await sendMessage(payload)
            if (response?.data?.success) {
                setMessageList(prev => [...prev, payload]);
                setEnteredMessage('')
                scrollToBottom()
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
        <div className={ `${classes.container}  `}>
            {selectedChatId ?
                <>
                    <div style={{ height: '2rem', backgroundColor: '#496DDB', padding: '1rem', display: 'flex', alignItems: 'center', gap: 5, position: 'sticky' }}>
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
                                    nextItem = {messageList[index+1]?.sentBy}
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