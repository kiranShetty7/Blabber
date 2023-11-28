import * as React from 'react';
import ProfilePic from "../../ProfilePic/ProfilePic"
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import classes from './ChatWindow.module.css'
import { useSelector } from 'react-redux';
import { getUserName } from "../../../utils/GetChatName";
import Message from '../Message/Message';
const ChatWindow = () => {

    const store = useSelector((state) => state)
    const chatState = store.chat
    const [chatList, setChatList] = React.useState([])
    const [isGroupChat, setIsGroupChat] = React.useState(false)

    const test = [{
        message:"In this example, the transition property is added to ensure a smooth transition over 10 seconds when the transform property changes. The transform: scale(2) on hover will scale the element to twice its original size, creating the desired effect. Adjust the values as needed.",
        timeStamp:'12:18pm',
        sentBy:'204r981426r812634823'
    },
    {
        message:"Hi",
        timeStamp:'2:18am',
        sentBy:localStorage.getItem('userId')
    }]


    React.useEffect(() => {
        setChatList(chatState.selectedChatDetails?.users)
        setIsGroupChat(chatState.selectedChatDetails?.isGroupChat)
    }, [chatState.selectedChatDetails])


    return (
        <div style={{ height: '100vh', position: 'relative' }}>
            <div style={{ height: '2rem', backgroundColor: '#496DDB', padding: '1rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                <ProfilePic src={chatState.profilePic} />
                <h3 style={{ color: '#fff' }}>{!isGroupChat ? getUserName(chatList) : chatState.selectedChatDetails.chatName}</h3>

            </div>
            <div >
                {test.map((messages,index)=>(
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
                    placeholder='Share Your Blab!'
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><SendIcon className={classes.searchIcon} /></InputAdornment>,
                    }}
                />
            </div>
        </div>)
}

export default ChatWindow