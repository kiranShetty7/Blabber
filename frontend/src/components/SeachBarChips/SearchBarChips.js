import { useState } from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import classes from './SearchBarChips.module.css';
import InputLabel from '@mui/material/InputLabel';
import { getBlabberUsers } from '../../services/blabberApiHandler';
import ProfilePic from '../ProfilePic/ProfilePic';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import { useDispatch } from 'react-redux';
import { updateSnackBar } from '../../store/SnackBarSlice';
import { updateGroupMembers } from '../../store/AddGroupSlice';
import { Chip } from '@mui/material';


function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

const SearchBarWithChips = (props) => {
    const [displayMenu, setDisplayMenu] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [groupMembers, setGroupMembers] = useState([])
    const [searchValue, setSearchValue] = useState([])
    const [error, setError] = useState(false)
    const dispatch = useDispatch();



    const debouncedGetMenuItems = debounce(async (value) => {
        try {
            const response = await getBlabberUsers(value);
            if (response.data.success) {
                setDisplayMenu(true);
                const data = response?.data?.data?.filter((item) => !groupMembers.includes(item?.name))
                console.log(data)
                setMenuItems(data);
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

    const deleteGroupMembers = (user) => {
        const remainingGroupMembers = groupMembers.filter((filterItem) => filterItem._id !== user._id)
        setGroupMembers(remainingGroupMembers)
        dispatch(updateGroupMembers({
            groupMembers: remainingGroupMembers
        }))

    };

    const addGroupMembers = (user) => {
        if (groupMembers.length < 9) {
            setGroupMembers(prev => [...prev, user])
            setSearchValue(() => "")
            dispatch(updateGroupMembers({
                groupMembers: [...groupMembers, user]
            }))



        }
        else
            setError(true)
        hideMenuItem()
    }
    const getMenuItems = (e) => {
        setSearchValue(() => e.target.value)
        debouncedGetMenuItems(e.target.value);
    };

    const hideMenuItem = () => {
        setDisplayMenu(false);
    };

    return (
        <div className={`${classes.searchContainer} ${props.className}`}>
            {props?.label && <InputLabel className={classes.inputLabel}>{props?.label}</InputLabel>}
            <div style={{ display: 'flex', padding: '1rem', gap: '10px', flexWrap: 'wrap' }}>
                {
                    groupMembers?.map((item, index) => (
                        <Chip label={item.name} key={index} variant="outlined" onDelete={() => deleteGroupMembers(item)} style={{ backgroundColor: "#7584f4", color: "#fff" }} />
                    ))
                }

            </div>
            {error && <p className={classes.error}>Max 10 members allowed in the group including you</p>}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <TextField
                    id="outlined-start-adornment"
                    className={classes.search}
                    value={searchValue}
                    placeholder="Find fellow blabberes..."
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><SearchIcon className={classes.searchIcon} /></InputAdornment>,
                    }}
                    onChange={getMenuItems}
                />
                {displayMenu && (
                    <div className={classes.dropDown} >
                        {menuItems?.length > 0 ? (
                            menuItems?.map((item) => (
                                <div className={classes.menuItem} key={item._id} onClick={() => addGroupMembers(item)}>
                                    <ProfilePic src={item.profilePic} />
                                    <span >{item.name}</span>
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
        </div>
    );

};

export default SearchBarWithChips;
