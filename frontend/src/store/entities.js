import { csrfFetch } from "./csrf";

const LOAD = "entities/LOAD";
const REMOVE_USERSPOT = "spot/REMOVE";
const EDIT = "entities/EDID";
const ADD = "entities/ADD";
const ADD_IMG = "image/ADD";

const loadSpots = (spots) => ({
  type: LOAD,
  spots,
  key: "spots",
});
const loadSpot = (spot) => ({
  type: LOAD,
  spot,
  key: "spot",
});
const loadUserSpots = (userSpots) => ({
  type: LOAD,
  userSpots,
  key: "userSpots",
});
const createSpot = (spot) => ({
  type: ADD,
  spot,
  key: "spot",
});
const editUserSpot = (userSpots, id) => ({
  type: EDIT,
  userSpots,
  key: "userSpots",
  id,
});
const editUserReview = (userReview, id) => ({
  type: EDIT,
  userReview,
  key: "userReview",
  id,
});
const deleteSpot = (id) => ({
  type: REMOVE_USERSPOT,
  id,
});
const addSpotImg = (image, spotId) => ({
  type: ADD_IMG,
  image,
  spotId,
});
export const restoreSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  const data = await res.json();
  let spots = flattingArray(data.Spots);
  // data.Spots.forEach((spot) => (spots[spot.id] = spot));
  dispatch(loadSpots(spots));
  return spots;
};

//get all spots
export const loadSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  const data = await res.json();
  let spots = flattingArray(data.Spots);
  // data.Spots.forEach((spot) => (spots[spot.id] = spot));
  dispatch(loadSpots(spots));
  return spots;
};
//get current user spots
export const loadUserSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current");
  const data = await res.json();
  let userSpots = flattingArray(data.Spots);
  dispatch(loadUserSpots(userSpots));
  return userSpots;
};
export const loadOneSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  const spot = await res.json();
  dispatch(loadSpot(spot));
  return spot;
};
// get current user reviews
export const loadUserReviewsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/reviews/current");
  const data = await res.json();
  let userReviews = flattingArray(data.Reviews);
  dispatch(loadUserSpots(userReviews));
  return userReviews;
};
//get reviews of spotID
export const loadSpotReviewsThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const data = await res.json();
  let spotReviews = flattingArray(data.Reviews);
  dispatch(loadUserSpots(spotReviews));
  return spotReviews;
};
//create spot
export const createSpotThunk = (inputSpot) => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify(inputSpot),
  });
  const spot = await res.json();
  dispatch(createSpot(spot));
  return spot;
};
//edit spot reload current user spots
export const editSpotThunk = (spotId, spot) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    body: JSON.stringify(spot),
  });
  const data = await res.json();
  dispatch(editUserSpot(data, spotId));
  return res;
};
//delete spot
export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  const data = await res.json();
  dispatch(deleteSpot(spotId));
  return data;
};
//add spot image
export const addSpotImgThunk = (spotId, img) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: JSON.stringify(img),
  });
  const image = await res.json();
  dispatch(addSpotImg(image, spotId));
  return image;
};
const initialSpots = {};
const entitiesReducer = (state = initialSpots, action) => {
  let newState;
  let spot;
  switch (action.type) {
    //get all spots,get all spots of current user,get all reviews of current user,get all reviews of spot by id
    // newState=updateObject({},state)
    // newState[sliceKey(action.payload)]={...action.payload}
    // newState.spots=
    // newState.userSpots=
    // newState.userReviews=
    // newState.spotReviews=
    case LOAD:
      newState = updateObject({}, state);
      newState[action.key] = { ...action[action.key] };
      return newState;
    case EDIT:
      //edit a spot edit a review--payload spot userSpot--/review id exit
      newState = updateObject({}, state);
      newState[action.key][action.id] = {
        ...newState[action.key][action.id],
        ...action[action.key],
      };
      return newState;
    case ADD:
      //add a spot--userSpots(edit button) or single spot(in detail page) detail add a review--userReview--current user(not owner)
      newState = updateObject({}, state);
      newState[action.key] = { ...action[action.key] };
      return newState;
    case REMOVE_USERSPOT: //delete spot review current user id
      newState = updateObject({}, state);
      delete newState.userSpots[action.id];
      return newState;
    case ADD_IMG: //under one spot==>userspots update both,spotID
      newState = updateObject({}, state);
      let targetSpot = newState.spot;
      if (targetSpot.SpotImages === "Spot has no image yet")
        targetSpot.SpotImages = action.image;
      else targetSpot.SpotImages.push(action.image);
      if (action.image.preview && newState.userSpots[targetSpot.id])
        newState.userSpots[targetSpot.id].previewImage = action.image.url;
      return newState; //{spots:{1:{id...images}}}

    default:
      return state;
  }
};
export default entitiesReducer;

function updateObject(oldObject, newValues) {
  return Object.assign({}, oldObject, newValues);
}
function updateItemInArray(array, itemId, updateItemCallback) {
  const updatedItems = array.map((item) => {
    if (item.id !== itemId) {
      // Since we only want to update one item, preserve all others as they are now
      return item;
    }
    // Use the provided callback to create an updated item
    const updatedItem = updateItemCallback(item);
    return updatedItem;
  });

  return updatedItems;
}
function flattingArray(array) {
  let obj = {};
  array.forEach((el) => (obj[el.id] = el));
  return obj;
}
function sliceKey(obj) {
  return Object.keys(obj)[0];
}
