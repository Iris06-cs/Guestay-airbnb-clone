//actions specific to the spots related info and reducer
import { csrfFetch } from "./csrf";

const ADD_SPOTS = "spots/addSpots";
const REMOVE_SPOT = "spots/removeSpots";

const initialState = {};
const spotsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case ADD_SPOTS:
      // newState = { ...state };
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_SPOT:
      // newState = { ...state };
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};
export default spotsReducer;
