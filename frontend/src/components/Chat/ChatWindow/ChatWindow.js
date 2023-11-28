import * as React from 'react';
import ProfilePic from "../../ProfilePic/ProfilePic"
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import classes from './ChatWindow.module.css'
import { useSelector } from 'react-redux';
import { getUserName } from "../../../utils/GetChatName";

const ChatWindow = () => {

    const store = useSelector((state) => state)
    const chatState = store.chat
    const [chatList, setChatList] = React.useState([])
    const [isGroupChat, setIsGroupChat] = React.useState(false)


    React.useEffect(() => {
        setChatList(chatState.selectedChatDetails?.users)
        setIsGroupChat(chatState.selectedChatDetails?.isGroupChat)
    }, [chatState.selectedChatDetails])


    return (
        <div style={{ height: '100vh', position: 'relative' }}>
            <div style={{ height: '2rem', backgroundColor: '#496DDB', padding: '1rem', display: 'flex', alignItems: 'center', gap: 25 }}>
                <ProfilePic src={chatState.profilePic} />
                <h3 style={{ color: '#fff' }}>{!isGroupChat ? getUserName(chatList) : chatState.selectedChatDetails.chatName}</h3>

            </div>
            <div >
                <div style={{ display: 'flex', justifyContent: 'left' }}>
                    <div style={{ borderRadius: '15px', padding: '1rem', margin: '1rem', backgroundColor: '#E6E1C5', display: 'grid', gridTemplateColumns: '3fr 0.4fr', maxWidth: '30rem' }}>
                        <span style={{ fontSize: '1rem', justifySelf: 'center', padding: '2px' }}>In this example, the transition property is added to ensure a smooth transition over 10 seconds when the transform property changes. The transform: scale(2) on hover will scale the element to twice its original size, creating the desired effect. Adjust the values as needed.</span>
                        <span style={{ fontSize: '10px', justifySelf: 'end', alignSelf: 'end' }}>  12:30 am</span>
                    </div>

                </div>
                <div style={{ display: 'flex', justifyContent: 'right' }}>
                    <span style={{ borderRadius: '20px', padding: '1rem', margin: '1rem', backgroundColor: '#8F95D3' }}>Hi</span>
                </div>
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