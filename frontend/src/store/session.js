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
    if (response.ok) {
      const data = await response.json();
      dispatch(addSession(data.user));
      return data;
    }
  };
// export const logoutThunk = () => async (dispatch) => {
//   const response = await csrfFetch("/api/session", {
//     method: "DELETE",
//   });
//   if (response.ok) {
//     const deleteMsg = await response.json();
//     dispatch(removeSession());
//   }
// };
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
