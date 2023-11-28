import classes from './ProfilePic.module.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProfilePic = (props) => {
    return (
        props.src ?
            <img src={props.src} alt="Chat image" className={classes.profile} /> :
                <AccountCircleIcon className={classes.noImage} />
    );
};

export default ProfilePic;
