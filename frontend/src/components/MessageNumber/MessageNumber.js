import classes from './MessageNumber.module.css'

const MessageNumber = (props) => {
    return (
        <div className={classes.messageNumber}> {props.children} </div>
    )
}

export default MessageNumber;