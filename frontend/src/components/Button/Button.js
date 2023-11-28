import Button from '@mui/material/Button';
import classes from './Button.module.css'

const BlabberButton = (props) => {
    return (
        <Button
            {...props}
            variant="contained"
            className={classes.button}
            sx={{ ...props.sx, textTransform: 'initial', backgroundColor: '#7584F4' }}
            disabled={props.disabled}
        >{props.children}</Button>
    )
}

export default BlabberButton