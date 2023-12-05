import * as React from 'react';
import classes from './GlobalNavBar.module.css'
import LOGO from '../../assets/blabberLogo.png'
import ProfilePic from '../ProfilePic/ProfilePic'
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router';
import { useDispatch } from "react-redux";
import { updateAppLoader } from '../../store/LoaderSlice';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const GlobalNavbar = () => {
  const profilePicSrc = localStorage.getItem('profilePic')
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(
      updateAppLoader({
        loading: true
      })
    )
    setTimeout(() => {
      localStorage.clear()
      navigate('/')
      dispatch(
        updateAppLoader({
          loading: false
        })
      )
    }, 1000)
  }

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.logoContainer}>  <img src={LOGO} className={classes.logo}></img><span className={classes.text}>Blabber</span></div>
        <div className={classes.logoutContainer}>
          <ProfilePic src={profilePicSrc} onClick={handleClick} className={classes.navProfile} />

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <div style={{ padding: '1rem', borderBottom: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
             <a href={profilePicSrc}> <ProfilePic src={profilePicSrc} className={classes.profile} /></a>
              <span style={{ fontSize: '1.5rem' }}>{localStorage.getItem('name')}</span>
              <span style={{ fontSize: '0.75rem' }}>{localStorage.getItem('email')}</span>

            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5, cursor: 'pointer', padding: 5 }} onClick={handleLogout}>
              <LogoutIcon /> Logout
            </div>
          </Menu>
        </div>
      </div>
    </div>)
}

export default GlobalNavbar