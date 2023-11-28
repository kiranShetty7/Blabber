import classes from './ChatLayout.module.css'
import ChatList from '../../components/Chat/ChatList/ChatList'
import ChatWindow from '../../components/Chat/ChatWindow/ChatWindow'
import CreateGroup from '../../components/CreateGroupModal/CreateGroup'

const ChatLayout = () => {
    return (
        <>
            <CreateGroup />
            <div className={classes.gridContainer}>
                <div >
                    <ChatList />
                </div>
                <div >
                    <ChatWindow />
                </div>
            </div>
        </>
    )
}

export default ChatLayout