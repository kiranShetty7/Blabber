import classes from './ProfilePic.module.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProfilePic = (props) => {

    const checkValidity = (src)=>{
        if(src === "null" || src === undefined || !src)
        return false
    return true
    }



    return (
        <>
       { checkValidity(props.src) ?
            <img src={"http://res.cloudinary.com/dxludokby/image/upload/v1699627813/st4aya4sow51efzcdlw2.jpg"} alt="Chat image" className={classes.profile} /> :
                <AccountCircleIcon className={classes.noImage} />}
        </>
    );
};

export default ProfilePic;
