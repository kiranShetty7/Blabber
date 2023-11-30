import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    open: false,
    severity: '',
    message: ''
};


const snackBarSlice = createSlice({
    name: 'snackBar',
    initialState,
    reducers: {
        updateSnackBar(state, action) {
            console.log(state)
            state.open = action.payload.open;
            state.severity = action.payload.severity;
            state.message = action.payload.message;
        },

    },
});

export const { updateSnackBar } = snackBarSlice.actions;
export default snackBarSlice.reducer;
