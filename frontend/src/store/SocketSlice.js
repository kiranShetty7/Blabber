import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    socket: null,
};


const socketSlice = createSlice({
    name: 'loader',
    initialState,
    reducers: {
        updateSocket(state, action) {
            state.socket = action.payload.socket;
        },

    },
});

export const { updateSocket } = socketSlice.actions;
export default socketSlice.reducer;
