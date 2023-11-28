import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    open: false,
    groupMembers: []
};


const addGroupSlice = createSlice({
    name: 'addGroup',
    initialState,
    reducers: {
        updateGroupModal(state, action) {
            state.open = action.payload.open;
        },
        updateGroupMembers(state, action) {
            state.groupMembers = action.payload.groupMembers;
        },

    },
});

export const { updateGroupModal, updateGroupMembers } = addGroupSlice.actions;
export default addGroupSlice.reducer;
