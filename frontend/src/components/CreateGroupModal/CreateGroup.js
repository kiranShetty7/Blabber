import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '../Button/Button'
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import classes from './CreateGroup.module.css'
import SearchBarWithChips from '../SeachBarChips/SearchBarChips';
import { useSelector, useDispatch } from "react-redux";
import { updateGroupModal, updateGroupMembers } from '../../store/AddGroupSlice';
import ImageUpload from '../ImageUpload/ImageUpload';
import { createBlabberChat } from '../../services/blabberApiHandler';
import { updateSnackBar } from '../../store/SnackBarSlice';
import { useForm } from 'react-hook-form';
import { updateChatList } from '../../store/ChatSlice';
import moment from 'moment'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};


const CreateGroup = (props) => {
    const {
        handleSubmit,
        register,
        setError,
        clearErrors,
        reset,
        formState: { errors },
    } = useForm();

    const [open, setOpen] = React.useState(false);
    const [picLoading, setPicLoading] = React.useState(false);
    const [chatName, setChatName] = React.useState("");
    const store = useSelector((state) => state)
    const addGroupState = store.addGroup
    const imageLoaderState = store.imageUpload
    const dispatch = useDispatch()

    const handleCreateGroup = async () => {
        const currentUser = localStorage.getItem('userId')
        if (addGroupState.groupMembers?.length === 0) {
            setError('group', {
                type: 'custom',
                message: 'Please add atleast one group member',
            });
            return;
        }
        const users = addGroupState.groupMembers?.map((item) => item?._id)

        const payload = {
            isGroupChat: true,
            users: [...users,currentUser],
            groupAdmin:currentUser ,
            chatName: chatName,
            profilePic: localStorage.getItem('uploadProfileLink'),
        }

        try {
            const response = await createBlabberChat(payload)
            console.log(response?.data)
            if (response?.data?.success) {

                dispatch(
                    updateGroupModal({
                        open: false
                    })
                )

                dispatch(
                    updateSnackBar({
                        open: true,
                        severity: 'success',
                        message: `Blabber Chat created sucessfully`

                    })
                )

                dispatch(
                    dispatch(updateGroupMembers({
                        groupMembers: []
                    }))
                )

                dispatch(
                    updateChatList(
                        {
                            chatList: [{
                                "_id": response?.data?.chatId,
                                "isGroupChat": true,
                                "users": users,
                                "groupAdmin": localStorage.getItem('userId'),
                                "chatName": chatName,
                                "profilePic": localStorage.getItem('uploadProfileLink'),
                                "createdAt": moment().toISOString(),
                            }]
                        }
                    )
                )


                localStorage.removeItem('uploadProfileLink')
                reset()

            }
            else {
                dispatch(
                    updateSnackBar({
                        open: true,
                        severity: 'error',
                        message: 'Failed to create the group'
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
    }

    const handleClose = () => {
        const payload = {
            open: false
        }

        dispatch(updateGroupModal(payload))
    }

    React.useEffect(() => {
        console.log(addGroupState)
        setOpen(addGroupState.open)
    }, [addGroupState.open])

    React.useEffect(() => {
        setPicLoading(imageLoaderState.loading)

    }, [imageLoaderState.loading])


    React.useEffect(() => {
        if (addGroupState.groupMembers.length > 0)
            clearErrors('group');

    }, [addGroupState.groupMembers])

    return (
        <div >
            {/* <Button onClick={handleOpen}>O</Button> */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <form onSubmit={handleSubmit(handleCreateGroup)}>
                    <Box sx={style}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} onClick={handleClose}>
                            <h3>Create your blabber gang...!</h3>
                            <CloseIcon style={{ cursor: 'pointer' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                            <TextField
                                id="outlined-basic"
                                label="Whisper your blabber gang name"
                                variant="outlined"
                                sx={{ width: '100%' }}
                                {...register('name', {
                                    required: 'Group name is required',
                                    onChange: (e) => {
                                        setChatName(e.target.value);  // Set local state
                                        clearErrors('name');  // Clear errors for the 'name' field
                                    },
                                })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </div>
                        <SearchBarWithChips label="Add your fellow blabberers" className={classes.search} />
                        {errors.group && <p className={classes.error}>{errors.group && errors.group.message}</p>}
                        <ImageUpload className={classes.imageUpload} />
                        <Button
                            sx={{ width: '100%', mt: 2 }}
                            type="submit"
                            disabled={Object.keys(errors).length > 0 || picLoading}

                        >
                            Build your Blabber Brigade !
                        </Button>
                    </Box>
                </form>
            </Modal>
        </div>
    );
}

export default CreateGroup