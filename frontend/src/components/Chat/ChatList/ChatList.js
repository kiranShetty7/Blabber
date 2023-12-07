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
import { updateSelectedChatDetails, updateMessage } from '../../../store/ChatSlice';
import { getUserName } from '../../../utils/GetChatName';
import { getTime } from '../../../utils/getTime';
import { updateAppLoader } from '../../../store/LoaderSlice';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router';
import CreateGroup from '../../CreateGroupModal/CreateGroup';
import { getUserProfilePic } from '../../../utils/getUserProfilePoc';
import { useSocket } from '../../../context/Socket';
import moment from 'moment';

const ChatList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [chatList, setChatList] = React.useState([])
  const store = useSelector((state) => state)
  const chatState = store.chat
  const location = useLocation()
  const searchParams = new URLSearchParams(location?.search);
  const chatId = searchParams.get('chatId');
  const userId = localStorage.getItem('userId');
  const socket = useSocket()
  const [storedChat, setStoredChat] = React.useState({})

  React.useEffect(() => {
    fetchData()
  }, [])

  React.useEffect(() => {
    const storedChatString = localStorage.getItem('chatDetails');
    const parsedStoredChat = storedChatString ? JSON.parse(storedChatString) : null;
    setStoredChat(parsedStoredChat)
  }, [chatId]);

  React.useEffect(() => {
    setChatList(prev => [...chatState.chatList, ...prev])
  }, [chatState.chatList])

  React.useEffect(() => {
    setChatList(prev => prev.map((chatItem) => {
      if (chatItem._id === chatState.chatIdToBeUpdated)
        return {
          ...chatItem,
          read: true
        }
      else
        return chatItem
    }))
  }, [chatState.chatIdToBeUpdated])


  React.useEffect(() => {

    socket?.on("message received", (chat) => {
      console.log(chat)
      if (chat?.chatId === storedChat?._id) {
        dispatch(updateMessage({ newMessage: chat }))
      }
      else {

        const newChat = chatList?.filter((chatItem) => chatItem?._id === chat?.chatId)
        if (newChat?.length > 0) {
          const data = chatList.map((chatItem)=>{
            if(chatItem?._id === chat?.chatId)
            return{
              ...chat,
              latestMessage: { message: chat?.message },
               _id: chat.chatId,
               createdAt: moment().toISOString()
            }
            else
            return chatItem
          })
          const sortedData = data.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
          setChatList([...sortedData])
        }
        else{
          setChatList((prev) =>
          [{
            ...chat,
            latestMessage: { message: chat?.message }, _id: chat.chatId
          }, ...prev])
        }

      }
    });

    return () => {
      socket?.off("message received");
    };


  }, [storedChat]);

  const fetchData = async () => {
    dispatch(
      updateAppLoader({
        loading: true
      })
    )
    try {
      const response = await getBlabberChats()
      if (response?.data?.success) {
        setChatList(response?.data?.data)
        dispatch(
          updateInitialChatList({
            initialChatList: response?.data?.data
          })
        )
      }
      else {
        // dispatch(
        //   updateSnackBar({
        //     open: true,
        //     severity: 'error',
        //     message: 'Failed to fetch chats'
        //   })
        // )
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
    dispatch(
      updateAppLoader({
        loading: false
      })
    )
  }

  const handleModalOpen = () => {
    const payload = {
      open: true
    }

    dispatch(updateGroupModal(payload))
  }

  const handleClick = (chat) => {
    const chatString = JSON.stringify(chat);
    localStorage.setItem('chatDetails', chatString);
    navigate(`/chats?chatId=${chat._id}`);
  }


  return (
    <div className={`${classes.container}  ${chatId ? classes.noDisplay : ''}`}>
      <CreateGroup />
      <div className={classes.header}>
        <SearchBar className={classes.search} />
        <GroupAddIcon className={classes.groupAddIcon} onClick={handleModalOpen} />
      </div>
      <div className={classes.chatList}>
        {chatList.map((chat, index) => (
          <ChatItem
            id={chat._id}
            isGroupChat={chat.isGroupChat}
            profilePic={chat.isGroupChat ? chat.profilePic : getUserProfilePic(chat?.users)}
            chatName={chat.isGroupChat ? chat.chatName : getUserName(chat?.users)}
            latestMessage={chat.latestMessage?.message}
            created={chat.createdAt}
            read={chat?.read}
            key={index}
            onClick={() => handleClick(chat)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
