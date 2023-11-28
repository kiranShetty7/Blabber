import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
};


const loaderSlice = createSlice({
    name: 'loader',
    initialState,
    reducers: {
        updateAppLoader(state, action) {
            state.loading = action.payload.loading;
        },

    },
});

export const { updateAppLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
