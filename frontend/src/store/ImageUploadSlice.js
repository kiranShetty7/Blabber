import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
};


const imageUplaodSlice = createSlice({
    name: 'imageUpload',
    initialState,
    reducers: {
        updateLoader(state, action) {
            state.loading = action.payload.loading;
        },

    },
});

export const { updateLoader } = imageUplaodSlice.actions;
export default imageUplaodSlice.reducer;
