//actions specific to the spots related info and reducer
import { csrfFetch } from "./csrf";

const LOAD_ALL_SPOTS = "spots/loadAllSpots";
const ADD_SPOTS = "spots/addSpots";
const REMOVE_SPOT = "spots/removeSpots";
const ADD_IMG = "spots/addImg";
const GET_SPOT = "spots/getSpot";
const EDIT_SPOT = "spots/editSpot";
//actions creators
const loadAllSpots = (spots) => ({
  type: LOAD_ALL_SPOTS,
  payload: spots, //[]
});
const addSpot = (spot) => ({
  type: ADD_SPOTS,
  spot,
});
const deleteSpot = (id) => ({
  type: REMOVE_SPOT,
  id,
});
const editSpot = (spot) => ({
  type: EDIT_SPOT,
  spot,
});
const getSpot = (spot) => ({
  type: GET_SPOT,
  spot,
});
const addSpotImg = (image, spotId) => ({
  type: ADD_IMG,
  image,
  spotId,
});
//thunks
export const loadSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  const data = await res.json();
  let spots = {};
  data.Spots.forEach((spot) => (spots[spot.id] = spot));
  dispatch(loadAllSpots(spots));
  return spots;
};
export const loadOwnerSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current");
  const data = await res.json();
  let spots = {};
  data.Spots.forEach((spot) => (spots[spot.id] = spot));
  dispatch(loadAllSpots(spots));
  return spots;
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
export const editSpotThunk = (spotId, spot) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    body: JSON.stringify(spot),
  });
  const data = await res.json();
  dispatch(editSpot(data));
  return res;
};
export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  const data = await res.json();
  dispatch(deleteSpot(spotId));
  return data;
};

export const addSpotImgThunk = (spotId, img) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: JSON.stringify(img),
  });
  const data = await res.json();
  dispatch(addSpotImg(data, spotId));
  return data;
};
export const getSpotThunk = (spoId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spoId}`);
  const data = await res.json();
  dispatch(getSpot(data));
  return data;
};
const initialSpots = {};
const spotsReducer = (state = initialSpots, action) => {
  let newState;
  let spot;
  switch (action.type) {
    case LOAD_ALL_SPOTS:
      newState = { ...state };
      // newState = Object.assign({}, state);
      // newState.spots = action.payload;
      newState.spots = { ...action.payload };
      return newState;
    case EDIT_SPOT:
      newState = Object.assign({}, state);
      spot = newState.spots[action.spot.id];
      console.log("state", spot, action.spot.id);
      newState.spots[action.spot.id] = {
        ...action.spot,
        avgRating: spot.avgRating,
        previewImage: spot.previewImage,
      };
      return newState;
    case ADD_SPOTS:
      newState = Object.assign({}, state);
      // newState.spot = action.spot;
      newState.spots[action.spot.id] = action.spot;
      return newState;
    case REMOVE_SPOT:
      // newState = { ...state };
      newState = Object.assign({}, state);
      delete newState.spots[action.id];
      return newState;
    case ADD_IMG:
      newState = Object.assign({}, state);
      spot = newState.spots[action.spotId];
      //no preview image
      //has preview image, action.image.preview===true
      if (
        spot.previewImage === "Spot has no image yet" ||
        action.image.preview === true
      )
        spot.previewImage = action.image.url;
      const newSpot = { ...spot, images: action.image };
      newState.spots[action.spotId] = { ...newSpot };
      return newState; //{spots:{1:{id...images}}}
    case GET_SPOT:
      newState = { ...state };
      newState.spot = action.spot;
      return newState;
    default:
      return state;
  }
};
export default spotsReducer;
