import { configureStore } from '@reduxjs/toolkit';
import SnackBarSlice from './SnackBarSlice';
import AddGroupSlice from './AddGroupSlice';
import ImageUploadSlice from './ImageUploadSlice';
import ChatSlice from './ChatSlice';
import LoaderSlice from './LoaderSlice';
import SocketSlice from './SocketSlice';

const store = configureStore({
    reducer: {
        snackBar:SnackBarSlice ,
        addGroup:AddGroupSlice,
        imageUpload:ImageUploadSlice,
        chat:ChatSlice,
        loader:LoaderSlice,
        socket:SocketSlice
    },
});

export default store;