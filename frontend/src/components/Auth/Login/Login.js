import * as React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../Button/Button';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import classes from './Login.module.css'
import { loginOperation } from '../../../services/blabberApiHandler';
import { updateSnackBar } from '../../../store/SnackBarSlice';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = React.useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const onSubmit = async (data) => {
        const payload = {
            email: data.email,
            password: data.password
        }
        try {
            const response = await loginOperation(payload)
            console.log(response?.data)
            if (response?.data?.success) {
                localStorage.setItem('name', response?.data?.data?.name)
                localStorage.setItem('userId', response?.data?.data?.userId)
                localStorage.setItem('profilePic', response?.data?.data?.profilePic)
                localStorage.setItem('token', response?.data?.data?.token)
                navigate('/chats')
            }
            else {
                dispatch(
                    updateSnackBar({
                        open: true,
                        severity: 'error',
                        message: 'Failed to Login'
                    })
                )
            }
        }
        catch (error) {
            dispatch(
                updateSnackBar({
                    open: true,
                    severity: 'error',
                    message: 'Something went wrong'
                })
            )
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={classes.container}>
                    <TextField
                        id="email"
                        label="Summon your email spirit to this realm."
                        sx={{ width: '100%' }}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: 'Invalid email address'
                            }
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Shhh... Password Entry</InputLabel>
                        <OutlinedInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Shhh... Password Entry"
                            {...register('password', {
                                required: 'Password is required'
                            })}
                            error={!!errors.password}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ width: '100%', textTransform: 'initial', backgroundColor: "#7584F4" }}
                        disabled={Object.keys(errors).length > 0}
                    >
                        Start Blabbering!
                    </Button>
                </div>
            </form>
        </>
    )
}

export default Login;
