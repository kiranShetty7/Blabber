import { configureStore } from '@reduxjs/toolkit';
import SnackBarSlice from './SnackBarSlice';
import AddGroupSlice from './AddGroupSlice';
import ImageUploadSlice from './ImageUploadSlice';
import ChatSlice from './ChatSlice';
const store = configureStore({
    reducer: {
        snackBar:SnackBarSlice ,
        addGroup:AddGroupSlice,
        imageUpload:ImageUploadSlice,
        chat:ChatSlice
    },
});

export default store;