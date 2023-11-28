import { useState } from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import classes from './SearchBar.module.css';
import InputLabel from '@mui/material/InputLabel';
import { getBlabberUsers } from '../../services/blabberApiHandler';
import ProfilePic from '../ProfilePic/ProfilePic';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import { useDispatch, useSelector } from 'react-redux';
import { updateSnackBar } from '../../store/SnackBarSlice';
import { updateChatList } from '../../store/ChatSlice';
import { updateGroupModal } from '../../store/AddGroupSlice';
import { createBlabberChat } from '../../services/blabberApiHandler';
import moment, { localeData } from 'moment';

// Custom debounce function
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

const SearchBar = (props) => {
    const [displayMenu, setDisplayMenu] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const dispatch = useDispatch();
    const store = useSelector((state) => state)
    const chatList = store.chat

    // Create a debounced version of getMenuItems
    const debouncedGetMenuItems = debounce(async (value) => {
        try {
            const response = await getBlabberUsers(value);
            if (response.data.success) {
                setDisplayMenu(true);
                setMenuItems(response?.data?.data);
            } else {
                dispatch(
                    updateSnackBar({
                        open: true,
                        severity: 'error',
                        message: 'Failed to fetch blabber users',
                    })
                );
            }
        } catch (error) {
            dispatch(
                updateSnackBar({
                    open: true,
                    severity: 'error',
                    message: 'Something went wrong',
                })
            );
        }
    }, 300); // Adjust the debounce delay (e.g., 300 milliseconds)

    const createChat = async (item, payload, users) => {
        try {
            const response = await createBlabberChat(payload)
            console.log(response?.data)
            if (response?.data?.success) {

                dispatch(
                    updateGroupModal({
                        open: false
                    })
                )

                dispatch(
                    updateChatList(
                        {
                            chatList: [{
                                "_id": item._id,
                                "isGroupChat": false,
                                "users": users,
                                "profilePic": localStorage.getItem('uploadProfileLink'),
                                "createdAt": moment().toISOString(),
                            }]
                        }
                    )
                )
                setDisplayMenu(false)


                localStorage.removeItem('uploadProfileLink')

            }
            else {
                dispatch(
                    updateSnackBar({
                        open: true,
                        severity: 'error',
                        message: 'Failed to create the group'
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

    const handleClick = async (item) => {
        const currentUser = {
            name: localStorage.getItem('name'),
            email: localStorage.getItem('email'),
            _id: localStorage.getItem('userId'),
        }
        const users = [{ ...item }, { ...currentUser }]

        console.log(users)
        const userList = users.map((item) => item._id)

        const payload = {
            isGroupChat: false,
            users: userList
        }

        const userExists = chatList?.initialChatList?.filter((filterItem) => {
            if (!filterItem?.isGroupChat) {
                const isPresent = filterItem?.users?.some(user => user._id === item._id);
                return isPresent;
            }
            return false; 
        });
        
        
        console.log(userExists)
        if (userExists.length>0) {
            alert("ide kano chattu")
        }
        else
            createChat(item, payload, users)
    }

    const getMenuItems = (e) => {
        // Call the debounced function when the user types
        debouncedGetMenuItems(e.target.value);
    };

    const hideMenuItem = () => {
        setDisplayMenu(false);
    };

    return (
        <div className={`${classes.searchContainer}  ${props.className}`}>
            {props?.label && <InputLabel className={classes.inputLabel}>{props?.label}</InputLabel>}
            <TextField
                id="outlined-start-adornment"
                className={classes.search}
                placeholder="Find fellow blabberes..."
                InputProps={{
                    endAdornment: <InputAdornment position="end"><SearchIcon className={classes.searchIcon} /></InputAdornment>,
                }}
                onClick={(e) => e.stopPropagation()}
                onChange={getMenuItems}
                onMouseDown={hideMenuItem}
            />
            {displayMenu && (
                <div className={classes.dropDown}>
                    {menuItems?.length > 0 ? (
                        menuItems?.map((item, index) => (
                            <div className={classes.menuItem} key={index} onClick={() => handleClick(item)}>
                                <ProfilePic src={item.profilePic} />
                                <span>{item.name}</span>
                            </div>
                        ))
                    ) : (
                        <span className={classes.notFound}>
                            <DoNotDisturbAltIcon /> Blabberer not found
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
