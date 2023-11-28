import CircularProgress from '@mui/material/CircularProgress';
import classes from './Loader.module.css'

const Loader = () => {
    return (<>
        <CircularProgress className={classes.loader}/>
    </>)
}

export default Loader