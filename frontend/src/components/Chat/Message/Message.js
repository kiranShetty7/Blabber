import classes from './Message.module.css'
import { isFromCurrentUser } from '../../../utils/isFromCurrentUser'
import { getTime } from '../../../utils/getTime'
const Message = (props) => {

    const {content,timeStamp,sentBy} = props

    return (

        <div className={`${isFromCurrentUser(sentBy)?classes.sentMessagecontainer:classes.recievedMessagecontainer} `}>
            <div className={`${classes.messageDiv} ${isFromCurrentUser(sentBy)?classes.sentMessageColor:classes.receivedMessageColor}`}>
                <div className={classes.message}>{content}</div>
                <div className={classes.timeStamp}>{getTime(timeStamp)}</div>
            </div>
        </div>

    )
}

export default Message