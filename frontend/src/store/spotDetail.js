import { csrfFetch } from "./csrf";

const ADD_IMG = "spots/addImg";
const GET_SPOT = "spots/getSpot";

const getSpot = (spot) => {
  return {
    type: GET_SPOT,
    spot,
  };
};
const addSpotImg = (image, spotId) => {
  return {
    type: ADD_IMG,
    image,
    spotId,
  };
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
const spotDetailReducer = (state = initialSpots, action) => {
  let newState;
  switch (action.type) {
    case ADD_IMG:
      newState = Object.assign({}, state);
      newState[action.spotId]["images"][action.image.id] = action.image;
      let spot = newState[action.spoId];
      return newState; //{spots:{1:{id...images}}}
    case GET_SPOT:
      newState = { ...state };
      newState.spot = action.spot;
      return newState;
    default:
      return state;
  }
};
export default spotDetailReducer;
