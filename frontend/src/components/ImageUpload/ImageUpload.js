import * as React from 'react';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { useForm } from 'react-hook-form';
import classes from './ImageUpload.module.css'
import Loader from '../Loader/Loader'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDispatch } from 'react-redux';
import { updateLoader } from '../../store/ImageUploadSlice';

const ImageUpload = (props) => {
    const [picLoading, setPicLoading] = React.useState(false);
    const [uploadSuccess, setUploadSuccess] = React.useState(false);
    const dispatch = useDispatch()

    const {
        setError,
        clearErrors,
        formState: { errors },
        watch,
    } = useForm();

    const handleImageUpload = async (event) => {
        const pic = event.target.files[0];

        dispatch(updateLoader({loading:true}))
        setPicLoading(true);

        if (!pic) {
            clearErrors('image');
            return;
        }

        if (!['image/jpeg', 'image/png'].includes(pic.type)) {
            setError('image', {
                type: 'custom',
                message: 'Image must be in JPEG or PNG format',
            });
            event.target.value = '';
            return;
        }

        if (pic.size > 5 * 1024 * 1024) {
            setError('image', {
                type: 'custom',
                message: 'Image must be under 5MB',
            });
            event.target.value = '';
            return;
        }

        const data = new FormData();
        data.append('file', pic);
        data.append('upload_preset', 'Blabber');
        data.append('cloud_name', 'dxludokby');
        fetch('https://api.cloudinary.com/v1_1/dxludokby/image/upload', {
            method: 'post',
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                localStorage.setItem("uploadProfileLink",data.url)
                setPicLoading(false);
                dispatch(updateLoader({loading:false}))
                setUploadSuccess(true);
            })
            .catch((err) => {
                console.log(err);
                dispatch(updateLoader({loading:false}))
                setPicLoading(false);
            });

        clearErrors('image');
    };
    return (
        <div className={`${classes.container} ${props.className}`}>
            <input
                type="file"
                id="imageInput"
                accept=".jpg, .jpeg, .png"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
            />

            <span className={classes.error}>{errors.image && errors.image.message}</span>
            <span style={{ width: '100%', textAlign: 'center' }}>Weave your visual charm</span>
            <span style={{ fontSize: '0.75rem' }}>  Upload an image (JPEG or PNG, max 5MB)</span>
            {
                !picLoading ? (
                    uploadSuccess ? (
                        <div className={classes.uploadSuccess}>
                            <CheckCircleIcon />
                            <span>Uploaded successfully</span>
                        </div>
                    ) : (
                        <label htmlFor="imageInput">
                            <CloudUploadOutlinedIcon
                                sx={{ fontSize: '5rem', color: '#707070', cursor: 'pointer' }}
                            />
                        </label>
                    )
                ) : (
                    <Loader />
                )
            }
        </div>
    )
}

export default ImageUpload