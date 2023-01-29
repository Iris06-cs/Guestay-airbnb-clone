//actions specific to the session user's info and reducer
import { csrfFetch } from "./csrf";

const ADD_SESSION = "session/addSession";
const REMOVE_SESSION = "session/removeSession";

//actioin creators
const addSession = (user) => {
  return {
    type: ADD_SESSION,
    payload: user,
  };
};

const removeSession = () => {
  return {
    type: REMOVE_SESSION,
  };
};

//thunk creators
export const loginThunk =
  ({ credential, password }) =>
  async (dispatch) => {
    const response = await csrfFetch("/api/session", {
      method: "POST",
      body: JSON.stringify({ credential, password }),
    });
    const data = await response.json();
    dispatch(addSession(data.user));
    return response;
  };

export const restoreSessionThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(addSession(data.user));
  return response;
};

export const signupThunk = (newUser) => async (dispatch) => {
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(newUser),
  });
  const data = await response.json();
  dispatch(addSession(data.user));
  return response;
};
export const logoutThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "DELETE",
  });
  const deleteMsg = await response.json();
  dispatch(removeSession());
  return response;
};
const initialState = { user: null };
const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case ADD_SESSION:
      newState = { ...state };
      newState.user = action.payload;
      return newState;
    case REMOVE_SESSION:
      newState = { ...state };
      newState.user = null;
      return newState;
    default:
      return state;
  }
};
export default sessionReducer;
