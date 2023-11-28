import * as React from 'react';
import ProfilePic from "../../ProfilePic/ProfilePic"
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import classes from './ChatWindow.module.css'
import { useSelector } from 'react-redux';
import { getUserName } from "../../../utils/GetChatName";
import { sendMessage } from '../../../services/blabberApiHandler';
import NoChatSelected from '../NoChatSelected/NoChatSelected';
import Message from '../Message/Message';

const ChatWindow = () => {

    const store = useSelector((state) => state)
    const chatState = store.chat

    const [selectedChatId, setSelectedChatId] = React.useState('')
    const [chatList, setChatList] = React.useState([])
    const [isGroupChat, setIsGroupChat] = React.useState(false)
    const [enteredMessage,setEnteredMessage]  = React.useState("")

    const test = [{
        message: "In this example, the transition property is added to ensure a smooth transition over 10 seconds when the transform property changes. The transform: scale(2) on hover will scale the element to twice its original size, creating the desired effect. Adjust the values as needed.",
        timeStamp: '12:18pm',
        sentBy: '204r981426r812634823'
    },
    {
        message: "Hi",
        timeStamp: '2:18am',
        sentBy: localStorage.getItem('userId')
    }]


    React.useEffect(() => {
        setChatList(chatState.selectedChatDetails?.users)
        setIsGroupChat(chatState.selectedChatDetails?.isGroupChat)
        setSelectedChatId(chatState?.selectedChatDetails._id)
    }, [chatState.selectedChatDetails])


    const handleSendMessage = (event)=>{
        console.log(event)
        const payload = {
            
        }
    }
    return (
        <div className={classes.container}>
            {selectedChatId ?
                <>
                    <div style={{ height: '2rem', backgroundColor: '#496DDB', padding: '1rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <ProfilePic src={chatState.profilePic} />
                        <h3 style={{ color: '#fff' }}>{!isGroupChat ? getUserName(chatList) : chatState.selectedChatDetails.chatName}</h3>

                    </div>
                    <div >
                        {test.map((messages, index) => (
                            <Message
                                content={messages.message}
                                timeStamp={messages.timeStamp}
                                sentBy={messages.sentBy}
                            />
                        ))}
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, right: 0, left: 0, height: '4rem' }}>
                        <TextField
                            id="outlined-start-adornment"
                            className={classes.typingSection}
                            value={enteredMessage}
                            placeholder="Share Your Blab!"
                            onChange={(e)=>setEnteredMessage(()=>e.target.value)}
                            onKeyDown={(e)=>{
                                if(e.key === "Enter" && enteredMessage?.trim())
                                handleSendMessage(e)
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" onClick={(e)=>{
                                        if(enteredMessage?.trim())
                                        handleSendMessage(e)
                                    }}>
                                        <SendIcon className={enteredMessage.trim()?classes.sendButton:classes.notAllowed} />
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