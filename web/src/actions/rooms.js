import api from '../api';
import {
  FETCH_ROOMS_SUCCESS,
  FETCH_USER_ROOMS_SUCCESS,
  CREATE_ROOM_SUCCESS,
  ROOM_JOINED,
} from './action_types';

export const fetchRooms = () => {
  return dispatch => api.fetch('/rooms')
    .then((response) => {
      dispatch({ type: FETCH_ROOMS_SUCCESS, response });
    });
};

export const fetchUserRooms = (userId) => {
  return dispatch => api.fetch(`/users/${userId}/rooms`)
    .then((response) => {
      dispatch({ type: FETCH_USER_ROOMS_SUCCESS, response });
    });
};

export const createRoom = (data) => {
  return dispatch => api.post('/rooms', data)
    .then((response) => {
      dispatch({ type: CREATE_ROOM_SUCCESS, response });
      // TODO
      // push user to '/r/${response.data.id} route
    });
};

export const joinRoom = (roomId) => {
  return dispatch => api.post(`/rooms/${roomId}/join`)
    .then((response) => {
      dispatch({ type: ROOM_JOINED, response });
      // TODO
      // push user to '/r/${response.data.id} route
    });
};
