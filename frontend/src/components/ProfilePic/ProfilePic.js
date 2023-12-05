import classes from './ProfilePic.module.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProfilePic = (props) => {
    console.log(props)
    const checkValidity = (src)=>{
        if(src === "null" || src === undefined || !src)
        return false
    return true
    }



    return (
        <>
       { checkValidity(props.src) ?
            <img src={props.src} alt="Chat image" className={classes.profile} /> :
                <AccountCircleIcon className={classes.noImage} />}
        </>
    );
};

export default ProfilePic;
