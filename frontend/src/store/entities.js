import { csrfFetch } from "./csrf";

const LOAD = "entities/LOAD_FIELD";
const REMOVE_USERSPOT = "spot/REMOVE";
const REMOVE_USERREVIEW = "review/REMOVE";
const REMOVE_IMAGE = "image/REMOVE";
const REMOVE_REVIEWIMG = "reviewImg/REMOVE";
const EDIT = "entities/EDID";
const EDIT_REVIEW = "entities/EDID_REVIEW";
const EDIT_SPOT = "entities/EDID_SPOT";
const ADD = "entities/ADD";
const ADD_IMG = "image/ADD";
const ADD_REVIEWIMG = "reviewImage/ADD";
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
const loadSpotReviews = (spotReviews) => ({
  type: LOAD,
  spotReviews,
  key: "spotReviews",
});
const loadUserReviews = (userReviews) => ({
  type: LOAD,
  userReviews,
  key: "userReviews",
});
// const loadUserReview = (userReview) => ({
//   type: LOAD,
//   userReview,
//   key: "userReview",
// });
const createSpot = (spot) => ({
  type: ADD,
  spot,
  key: "spot",
});
const createReview = (spotReview) => ({
  type: ADD,
  spotReview,
  key: "spotReview",
});
const editUserSpot = (userSpots, id) => ({
  type: EDIT_SPOT,
  userSpots,
  key: "userSpots",
  id,
});
const editUserReview = (userReviews, id) => ({
  type: EDIT_REVIEW,
  userReviews,
  key: "userReviews",
  id,
});
const deleteSpot = (id) => ({
  type: REMOVE_USERSPOT,
  id,
});
const deleteReview = (id) => ({
  type: REMOVE_USERREVIEW,
  id,
});
const addSpotImg = (image, spotId) => ({
  type: ADD_IMG,
  image,
  spotId,
});
const addReviewImg = (image, reviewId) => ({
  type: ADD_REVIEWIMG,
  image,
  reviewId,
});
const removeSpotImg = (imgId) => ({
  type: REMOVE_IMAGE,
  imgId,
});
const removeReviewImg = (imgId, reviewId) => ({
  type: REMOVE_REVIEWIMG,
  imgId,
  reviewId,
});
//thunks
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
  let userSpots;

  if (typeof data.Spots === "string") userSpots = data.Spots;
  else userSpots = flattingArray(data.Spots);
  dispatch(loadUserSpots(userSpots));
  return userSpots;
};
export const loadOneSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  const spot = await res.json();
  dispatch(loadSpot(spot));
  return res;
};
// export const loadOneReviewThunk = (reviewId) => async (dispatch) => {
//   const res = await csrfFetch(`/api/reviews/${reviewId}`);
//   const review = await res.json();
//   console.log(review);
//   dispatch(loadUserReview(review));
//   return review;
// };
// get current user reviews
export const loadUserReviewsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/reviews/current");
  const data = await res.json();
  let userReviews = flattingArray(data.Reviews);
  dispatch(loadUserReviews(userReviews));
  return userReviews;
};
//get reviews of spotID
export const loadSpotReviewsThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const data = await res.json();
  let spotReviews = flattingArray(data.Reviews);
  dispatch(loadSpotReviews(spotReviews));
  return res;
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
//create review
export const createReviewThunk = (inputReview, spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify(inputReview),
  });
  const spotReview = await res.json();
  dispatch(createReview(spotReview));
  return spotReview;
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
export const editReviewThunk = (reviewId, review) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify(review),
  });
  const data = await res.json();
  dispatch(editUserReview(data, reviewId));
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
//delete review
export const deleteReviewThunk = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  const data = await res.json();
  dispatch(deleteReview(reviewId));
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
export const deleteSpotImg = (imgId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spot-images/${imgId}`, {
    method: "DELETE",
  });
  const msg = await res.json();
  dispatch(removeSpotImg(imgId));
  return msg;
};
export const addReviewImgThunk = (reviewId, image) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}/images`, {
    method: "POST",
    body: JSON.stringify(image),
  });
  const data = await res.json();
  dispatch(addReviewImg(data, reviewId));
  return data;
};
export const deleteReviewImg = (imgId, reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/review-images/${imgId}`, {
    method: "DELETE",
  });
  const msg = await res.json();
  dispatch(removeReviewImg(imgId, reviewId));
  return msg;
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
      if (typeof action[action.key] === "string")
        newState[action.key] = action[action.key];
      else newState[action.key] = { ...action[action.key] };
      return newState;
    case EDIT_SPOT:
      //edit a spot edit a review--payload spot userSpot--/review id exit
      newState = updateObject({}, state);
      newState.userSpots[action.id] = {
        ...newState.userSpots[action.id],
        ...action.userSpots,
      };
      //DO NOT MUTATE, action playload has fewer properties
      newState.spot = { ...newState.spot, ...action.userSpots };
      return newState;
    case EDIT_REVIEW:
      newState = updateObject({}, state);
      console.log(action, newState.userReviews);
      if (newState.userReviews) {
        newState.userReviews[action.id] = {
          ...newState.userReviews[action.id],
          ...action.userReviews,
        };
      }
      if (newState.spotsReviews) {
        newState.spotReviews[action.id] = {
          ...newState.spotReviews[action.id],
          ...action.spotReviews,
        };
      }
      return newState;
    case ADD:
      //add a spot--userSpots(edit button) or single spot(in detail page) detail add a review--userReview--current user(not owner)
      newState = updateObject({}, state);
      newState[action.key] = { ...action[action.key] };

      return newState;
    case REMOVE_USERSPOT: //delete spot review current user id
      newState = updateObject({}, state);

      delete newState.userSpots[action.id];
      if (newState.spot && newState.spot.id == action.id) delete newState.spot;
      return newState;
    case REMOVE_USERREVIEW: //delete spot review current user id
      newState = updateObject({}, state);
      if (newState.userReviews) delete newState.userReviews[action.id];
      if (newState.spotReviews) delete newState.spotReviews[action.id];
      if (newState.spotReview && newState.spotReview.id === Number(action.id))
        delete newState.spotReview;
      return { ...newState };
    case REMOVE_IMAGE:
      newState = updateObject({}, state);
      const imges = newState.spot.SpotImages.filter(
        (img) => img.id === action.imgId
      );
      newState.spot.SpotImages = [...imges];
      return newState;
    case REMOVE_REVIEWIMG:
      newState = updateObject({}, state);
      if (newState.userReviews) {
        const reviewImg = newState.userReviews[
          Number(action.reviewId)
        ].ReviewImages.filter((img) => img.id === action.imgId);
        newState.userReviews[Number(action.reviewId)].ReviewImages = [
          ...reviewImg,
        ];
      }
      if (newState.spotReviews) {
        const reviewImg = newState.spotReviews[
          Number(action.reviewId)
        ].ReviewImages.filter((img) => img.id === action.imgId);
        newState.spotReviews[Number(action.reviewId)].ReviewImages = [
          ...reviewImg,
        ];
      }
      return newState;
    case ADD_REVIEWIMG:
      newState = updateObject({}, state);
      if (
        newState.userReviews &&
        typeof newState.userReviews[action.reviewId].ReviewImages === "string"
      )
        newState.userReviews.ReviewImages = [action.image];
      else if (newState.userReviews)
        newState.userReviews[action.reviewId].ReviewImages.push(action.image);

      if (
        newState.spotReviews &&
        typeof newState.spotReviews[action.reviewId].ReviewImages === "string"
      )
        newState.spotReviews[action.reviewId].ReviewImages = [action.image];
      else if (newState.spotReviews) {
        // console.log(newState.spotReviews);
        newState.spotReviews[action.reviewId].ReviewImages.push(action.image);
      }
      //  else newState.userReviews.ReviewImages.push(action.image);
      return newState;
    case ADD_IMG: //under one spot==>userspots update both,spotID
      newState = updateObject({}, state);
      let targetSpot = newState.spot;
      if (targetSpot.SpotImages === "Spot has no image yet")
        targetSpot.SpotImages = [action.image];
      else targetSpot.SpotImages.push(action.image);
      if (
        action.image.preview &&
        newState.userSpots &&
        newState.userSpots[targetSpot.id]
      )
        newState.userSpots[targetSpot.id].previewImage = action.image.url;
      newState.spot = { ...targetSpot };
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
  if (typeof array !== "string") array.forEach((el) => (obj[el.id] = el));
  return obj;
}
function sliceKey(obj) {
  return Object.keys(obj)[0];
}
