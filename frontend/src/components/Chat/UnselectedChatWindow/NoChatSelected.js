import classes from './NoChatSelected.module.css'
import { useMediaQuery } from '@mui/material';


const NoChatSelected = () => {
    const isMobile = useMediaQuery('(max-width:768px)');

    return (
           <p className={classes.text}>Alright, time to pick a chat from the {isMobile?'top':'left'} to start blabbering !</p>
    )
}

export default NoChatSelected