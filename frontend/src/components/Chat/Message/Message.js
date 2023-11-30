import classes from './Message.module.css'
import { isFromCurrentUser } from '../../../utils/isFromCurrentUser'
import { getTime } from '../../../utils/getTime'
const Message = (props) => {

    const {content,timeStamp,sentBy} = props

    return (

        <div className={`${isFromCurrentUser(sentBy._id)?classes.sentMessagecontainer:classes.recievedMessagecontainer} `}>
            <div className={`${classes.messageDiv} ${isFromCurrentUser(sentBy?._id)?classes.sentMessageColor:classes.receivedMessageColor}`}>
               {!isFromCurrentUser(sentBy?._id)&& <div className={classes.sender}>{sentBy.name}</div>}
                <div className={classes.message}>{content}</div>
                <div className={classes.timeStamp}>{getTime(timeStamp)}</div>
            </div>
        </div>

    )
}

export default Message