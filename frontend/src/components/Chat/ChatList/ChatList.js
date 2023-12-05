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
import { getTime } from '../../../utils/getTime';
import { updateAppLoader } from '../../../store/LoaderSlice';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router';
import CreateGroup from '../../CreateGroupModal/CreateGroup';
import { updateSocket } from '../../../store/SocketSlice';
import { io } from 'socket.io-client'

const ChatList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [chatList, setChatList] = React.useState([])
  const store = useSelector((state) => state)
  const chatState = store.chat
  const location = useLocation()
  const searchParams = new URLSearchParams(location?.search);
  const chatId = searchParams.get('chatId');
  const endpoint = "http://localhost:4000"
  const [connectedToSocket, setConnectedToSocket] = React.useState(false)
  const [socket, setSocket] = React.useState(null)
  const userId = localStorage.getItem('userId');

  React.useEffect(() => {
    const newSocket = io(endpoint);
    console.log(newSocket)
    setSocket(newSocket);
    dispatch(updateSocket({
      socket: newSocket
    }))

    newSocket.emit("appEntered", userId);
    newSocket.on("connected", () => setConnectedToSocket(true));

  //   newSocket.on("message received", (chat) => {
  //     console.log(chat);
  //     console.log(chatId);
  //     if (chat?.chatId !== chatId) {
  //         // alert("sdcs cks")
  //     }
  // });

    return () => {
      newSocket.disconnect();
    };

  }, [])


  React.useEffect(() => {
    fetchData()
  }, [])

  React.useEffect(() => {
    setChatList(prev => [...chatState.chatList, ...prev])
    console.log('aaf')
  }, [chatState.chatList])

//   React.useEffect(() => {
//     if (chatId) {
      

//         return () => {
//             socket?.off("message received");
//         };
//     }

// }, [socket]);

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
    socket?.emit('chatEntered', chat._id);
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
        {chatList.map((chat) => (
          <ChatItem
            id={chat._id}
            isGroupChat={chat.isGroupChat}
            profilePic={chat.profilePic}
            chatName={chat.isGroupChat ? chat.chatName : getUserName(chat?.users)}
            latestMessage={chat.latestMessage?.message}
            created={chat.createdAt}
            read={chat?.read}
            onClick={() => handleClick(chat)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
