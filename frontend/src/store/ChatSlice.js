import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    initialChatList: [],
    newMessage:{},
    chatIdToBeUpdated:'',
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

        updateChat(state, action) {
          
            state.chatIdToBeUpdated = action.payload.chatIdToBeUpdated;
        },

        updateMessage(state,action){
            state.newMessage = action.payload.newMessage;
        }
    },
});

export const { updateChatList, updateInitialChatList, updateSelectedChatDetails,updateChat,updateMessage} = chatSlice.actions;
export default chatSlice.reducer;
