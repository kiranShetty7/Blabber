import * as React from 'react';
import MessageNumber from "../../MessageNumber/MessageNumber"
import moment from 'moment'
import Groups2Icon from '@mui/icons-material/Groups2';
import ProfilePic from '../../ProfilePic/ProfilePic';
import classes from './ChatItem.module.css'
import { useSelector } from 'react-redux';

const ChatItem = (props) => {
    const { latestMessage, created, profileLink, id, isGroupChat, chatName } = props
    const store = useSelector((state) => state)
    const chatState = store.chat
    const [selectedId, setSelectedId] = React.useState('')

    React.useEffect(() => {
        setSelectedId(chatState.selectedChatDetails._id);
    }, [chatState.selectedChatDetails._id]);

    return (
        <div key={id} className={`${classes.container} ${selectedId === id ? classes.selected : ''} `} onClick={props.onClick}>
            <div className={classes.item1} >
                <ProfilePic src={profileLink} />
            </div>
            <div className={classes.item2}>
                <p className={`${classes.chatName} `}>{chatName}</p>
                <div className={classes.latestMessage}>{latestMessage}</div>
            </div>
            <div className={classes.item3}>{isGroupChat && <Groups2Icon />} </div>
            <div className={classes.item4}>
                <span>{moment(created).format('hh:mm A')}</span>
                {/* <MessageNumber>4</MessageNumber> */}
            </div>
        </div>

    )
}

export default ChatItem