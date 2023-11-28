import * as React from 'react';
import SearchBar from '../../SearchBar/SearchBar';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import classes from './ChatList.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateGroupModal } from '../../../store/AddGroupSlice';
import ChatItem from '../ChatItem/ChatItem';
import { getBlabberChats } from '../../../services/blabberApiHandler';
import { updateSnackBar } from '../../../store/SnackBarSlice';
import { updateInitialChatList } from '../../../store/ChatSlice';
import { updateSelectedChatDetails } from '../../../store/ChatSlice';
import { getUserName } from '../../../utils/GetChatName';

const ChatList = () => {
  const dispatch = useDispatch()
  const [chatList, setChatList] = React.useState([])
  const store = useSelector((state) => state)
  const chatState = store.chat
 

  React.useEffect(() => {
    fetchData()
  }, [])

  React.useEffect(() => {
    setChatList(prev => [...chatState.chatList, ...prev])
  }, [chatState.chatList])

 

  const fetchData = async () => {
    try {
      const response = await getBlabberChats()
      console.log(response?.data)
      if (response?.data?.success) {
        console.log(response.data.data)
        setChatList(response?.data?.data)
        dispatch(
          updateInitialChatList({
            initialChatList: response?.data?.data
          })
        )
      }
      else {
        dispatch(
          updateSnackBar({
            open: true,
            severity: 'error',
            message: 'Failed to fetch chats'
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

  const handleModalOpen = () => {
    const payload = {
      open: true
    }

    dispatch(updateGroupModal(payload))
  }

  const handleClick = (chat) => {
    console.log("clickable",chat)
    dispatch(
      updateSelectedChatDetails({
        selectedChatDetails: chat
      })
    )
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <SearchBar className={classes.search} />
        <GroupAddIcon className={classes.groupAddIcon} onClick={handleModalOpen} />
      </div>
      <div className={classes.chatList}>
        {chatList.map((chat) => (
          <ChatItem
            id={chat._id}
            isGroupChat={chat.isGroupChat}
            profileLink={chat.profilePic}
            chatName={chat.isGroupChat ? chat.chatName : getUserName(chat?.users)}
            latestMessage={chat.latestMessage?.message}
            created={chat.createdAt}
            onClick={() => handleClick(chat)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
