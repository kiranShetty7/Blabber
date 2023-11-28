import {
  BLABBER_BASE_URL,
  VERSION,
  SIGN_UP,
  USER,
  CHAT,
  LOGIN,
  GET_BLABBER_USERS,
  CREATE_BLABBER_CHAT,
  GET_BLABBER_CHAT_LIST
} from "./Constants";
import axios from 'axios'


export async function loginOperation(payload) {
  return new Promise(async (resolve, reject) => {
    try {
      const URL = BLABBER_BASE_URL + VERSION + USER + LOGIN;
      const CONFIG = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post(URL, payload, CONFIG);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
}

export async function SignUpOperation(payload) {
  return new Promise(async (resolve, reject) => {
    try {
      const URL = BLABBER_BASE_URL + VERSION + USER + SIGN_UP;
      const CONFIG = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post(URL, payload, CONFIG);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
}

export async function getBlabberUsers(filter) {
  return new Promise(async (resolve, reject) => {
    try {
      const URL = BLABBER_BASE_URL + VERSION + USER + GET_BLABBER_USERS;
      const CONFIG = {
        headers: {
          'Content-Type': 'application/json',
          'userId': localStorage.getItem('userId')
        },
        params: {
          filter
        }

      };
      const response = await axios.get(URL, CONFIG);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
}

export async function createBlabberChat(payload) {
  return new Promise(async (resolve, reject) => {
    try {
      const URL = BLABBER_BASE_URL + VERSION + CHAT + CREATE_BLABBER_CHAT;
      const CONFIG = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post(URL, payload, CONFIG);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
}

export async function getBlabberChats() {
  return new Promise(async (resolve, reject) => {
    try {
      const URL = BLABBER_BASE_URL + VERSION + CHAT + GET_BLABBER_CHAT_LIST;
      const CONFIG = {
        headers: {
          'Content-Type': 'application/json',
          'userId': localStorage.getItem('userId')
        },

      };
      const response = await axios.get(URL, CONFIG);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
}