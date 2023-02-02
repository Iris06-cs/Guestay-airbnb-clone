//actions specific to the spots related info and reducer
import { csrfFetch } from "./csrf";

const LOAD_ALL_SPOTS = "spots/loadAllSpots";
const ADD_SPOTS = "spots/addSpots";
const REMOVE_SPOT = "spots/removeSpots";
const ADD_IMG = "spots/addImg";
//actions creators
const loadAllSpots = (spots) => {
  return {
    type: LOAD_ALL_SPOTS,
    spots, //[]
  };
};
const addSpot = (spot) => {
  return {
    type: ADD_SPOTS,
    spot,
  };
};
const addSpotImg = (image) => {
  return {
    type: ADD_IMG,
    image,
  };
};
//thunks
export const loadSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  const data = await res.json();
  dispatch(loadAllSpots(data.Spots));
  return data.Spots;
};
export const loadOwnerSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current");
  const data = await res.json();
  dispatch(loadAllSpots(data.Spots));
  return data.Spots;
};
export const createSpotThunk = (inputSpot) => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify(inputSpot),
  });
  const data = await res.json();
  dispatch(addSpot(data));
  return data;
};
export const addSpotImgThunk = (spotId, img) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: JSON.stringify(img),
  });
  const data = await res.json();
  dispatch(addSpotImg(data));
  return data;
};
const initialSpots = {};
const spotsReducer = (state = initialSpots, action) => {
  let newState;
  switch (action.type) {
    case LOAD_ALL_SPOTS:
      // newState = { ...state };
      newState = Object.assign({}, state);
      newState.spots = action.spots;
      return newState;
    case ADD_SPOTS:
      newState = Object.assign({}, state);
      newState.spot = action.spot;
      return newState;
    case REMOVE_SPOT:
      // newState = { ...state };
      newState = Object.assign({}, state);
      newState.spots = null;
      return newState;
    case ADD_IMG:
      newState = Object.assign({}, state);
      newState.image = action.image;
      return newState;
    default:
      return state;
  }
};
export default spotsReducer;
