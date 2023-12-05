import {
  BLABBER_BASE_URL,
  VERSION,
  SIGN_UP,
  USER,
  CHAT,
  LOGIN,
  GET_BLABBER_USERS,
  CREATE_BLABBER_CHAT,
  GET_BLABBER_CHAT_LIST,
  SEND_MESSAGE,
  GET_INDIVIDUAL_CHAT_DETAILS,
  READ_MESSAGE
} from "./Constants";
import axios from 'axios'
import history from "../RouterConfig/CustomBrowserHistory";

const instance = axios.create({})

instance.interceptors.request.use(
  (config) => {

    const userId = localStorage.getItem('userId')
    const authToken = localStorage.getItem('token');
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
      config.headers.userId = userId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use((response) => {

  return Promise.resolve(response);
}, (error) => {
  if (error.response && error.response.status === 401) {
    history.replace("/");
  }

});



export async function loginOperation(payload) {
  return new Promise(async (resolve, reject) => {
    try {
      const URL = BLABBER_BASE_URL + VERSION + USER + LOGIN;
      const CONFIG = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await instance.post(URL, payload, CONFIG);
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
      const response = await instance.post(URL, payload, CONFIG);
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
        },
        params: {
          filter
        }

      };
      const response = await instance.get(URL, CONFIG);
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
      const response = await instance.post(URL, payload, CONFIG);
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
        },

      };
      const response = await instance.get(URL, CONFIG);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
}

export async function sendMessage(payload) {
  return new Promise(async (resolve, reject) => {
    try {
      const URL = BLABBER_BASE_URL + VERSION + CHAT + SEND_MESSAGE;
      const CONFIG = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await instance.post(URL, payload, CONFIG);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
}

export async function getIndividualChat(chatId) {
  return new Promise(async (resolve, reject) => {
    try {
      const URL = BLABBER_BASE_URL + VERSION + CHAT + GET_INDIVIDUAL_CHAT_DETAILS + '/' + chatId;
      const CONFIG = {
        headers: {
          'Content-Type': 'application/json',
        },

      };
      const response = await instance.get(URL, CONFIG);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
}

export async function readMessageApiCall(chatId) {
  return new Promise(async (resolve, reject) => {
    try {
      const URL = BLABBER_BASE_URL + VERSION + CHAT + READ_MESSAGE + '/' + chatId;
      const CONFIG = {
        headers: {
          'Content-Type': 'application/json',
        },

      };
      const response = await instance.get(URL, CONFIG);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
}