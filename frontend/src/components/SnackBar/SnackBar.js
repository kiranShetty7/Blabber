import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';
import { useSelector,useDispatch } from "react-redux";
import { updateSnackBar } from '../../store/SnackBarSlice';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



const SnackBar = () => {
    const [open, setOpen] = React.useState(false);
    const store = useSelector((state) => state)
    const dispatch = useDispatch()
    const snackBarState = store.snackBar

    React.useEffect(() => {

        setOpen(snackBarState.open)
        setTimeout(() => {
            dispatch(
                updateSnackBar({
                    open: false,
                    severity: '',
                    message: ''
                })
            )
        }, 3000);
    }, [snackBarState.open])

    const handleClose = () => {
        dispatch(
            updateSnackBar({
                 open: false,
                    severity: '',
                    message: ''
            })
        )
    };

    return (
        <>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={snackBarState.severity} sx={{ width: '100%' }}>
                    {snackBarState.message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default SnackBar