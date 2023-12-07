import classes from './ProfilePic.module.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProfilePic = (props) => {
    const checkValidity = (src) => {
        if (src === "null" || src === undefined || !src)
            return false
        return true
    }
    return (
        <>
            {
                checkValidity(props.src) ?
                <img src={props.src} alt="Chat image" className={`${classes.profile} ${props.className}`} onClick={props.onClick} />
               
                    :
                    <AccountCircleIcon className={`${classes.noImage} ${props.className}`} onClick={props.onClick}/>
            }
        </>
    );
};

export default ProfilePic;
