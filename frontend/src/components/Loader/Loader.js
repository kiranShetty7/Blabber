import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import classes from './Loader.module.css'
import { useSelector } from "react-redux";

const Loader = () => {
    const [open, setOpen] = React.useState(false);
    const store = useSelector((state) => state)
    const loaderState = store.loader

    const handleClose = () => {
        setOpen(false);
    };
    React.useEffect(() => {
        setOpen(loaderState.loading)
    }, [loaderState.loading])

    return (<>
        <Backdrop
            sx={{ color: '#ffbc47', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            onClick={handleClose}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    </>)
}

export default Loader