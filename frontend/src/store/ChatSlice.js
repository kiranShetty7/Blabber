import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    initialChatList: [],
    chatList: [],
    selectedChatDetails: {
        _id: "",
        isGroupChat: true,
        users: [],
        groupAdmin: "",
        chatName: "",
        profilePic: "",
        createdAt: "",
    },
};


const chatSlice = createSlice({
    name: 'chatSlice',
    initialState,
    reducers: {
        updateInitialChatList(state, action) {

            state.initialChatList = action.payload.initialChatList;
        },

        updateChatList(state, action) {

            state.chatList = action.payload.chatList;
        },

        updateSelectedChatDetails(state, action) {
          
            state.selectedChatDetails = action.payload.selectedChatDetails;
        },
    },
});

export const { updateChatList, updateInitialChatList, updateSelectedChatDetails } = chatSlice.actions;
export default chatSlice.reducer;
