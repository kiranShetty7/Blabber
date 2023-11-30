import classes from './GlobalNavBar.module.css'
import LOGO from '../../assets/blabberLogo.png'
import ProfilePic from '../ProfilePic/ProfilePic'
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router';

 const GlobalNavbar = ()=>{
    const profilePicSrc = localStorage.getItem('profilePic')
    const navigate = useNavigate()

    const handleLogout = ()=>{
        localStorage.clear()
        navigate('/')
    }

    return(
    <div className={classes.container}>
        <div className={classes.innerContainer}>
        <div className={classes.logoContainer}>  <img src={LOGO} className={classes.logo}></img><span className={classes.text}>Blabber</span></div>
        <div className={classes.logoutContainer}>
            <ProfilePic src={profilePicSrc }/>
            <LogoutIcon className={classes.logout} onClick={handleLogout}/>
        </div>
        </div>
    </div>)
}

export default GlobalNavbar