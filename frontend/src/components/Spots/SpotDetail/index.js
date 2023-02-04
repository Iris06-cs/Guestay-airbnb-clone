//isLoaded && user==>logedin==>have leave a review feature
//spot.ownerId===user.id owner cannot review?

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SpotReviews from "../../Reviews/SpotReviews";
import * as entitiesActions from "../../../store/entities";
const SpotDetail = ({ isLoaded }) => {
  const { spotId } = useParams();
  const user = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.entities.spot);
  const reviews = useSelector((state) => state.entities.spotReviews);
  const dispatch = useDispatch();
  const [spotInfo, setSpotInfo] = useState("");
  const [reviewInfo, setReviewInfo] = useState("");
  const {
    id,
    ownerId,
    address,
    city,
    state,
    country,
    name,
    description,
    price,
    numReviews,
    avgStarRating,
    SpotImages,
    Owner,
  } = spotInfo;
  let previewImg;
  console.log(SpotImages);
  if (spotInfo.id) previewImg = SpotImages.find((img) => img.preview === true);
  //   const otherImges = SpotImages.filter((img) => img.id !== previewImg.id);

  useEffect(() => {
    dispatch(entitiesActions.loadOneSpotThunk(spotId));
  }, [dispatch, spotId]);
  useEffect(() => {
    dispatch(entitiesActions.loadSpotReviewsThunk(spotId));
  }, [dispatch, spotId]);
  useEffect(() => {
    if (spot) {
      setSpotInfo(spot);
    }
  }, [spot]);
  useEffect(() => {
    if (reviews) {
      setReviewInfo(reviews);
    }
  }, [reviews]);
  return (
    <div className="spot-details">
      {spotInfo.id && (
        <>
          <h1 className="spot-name-title">{name}</h1>
          <p className="spot-bio">
            <span>
              <i className="fa-solid fa-star"></i>
            </span>
            {avgStarRating === "Spot has no review yet"
              ? "New"
              : spot.avgRating}
            &#183;<u>{numReviews} reviews</u>.
            <span>
              <i className="fa-solid fa-medal"></i>
            </span>
            .<u>{`${city},${state},${country}`}</u>
          </p>
          <div className="share-save">
            <p>
              <span>
                <i className="fa-solid fa-arrow-up-from-bracket"></i>
              </span>
              &nbsp;&nbsp;
              <u>Share</u>
            </p>
            <p>
              <span>
                <i className="fa-regular fa-heart"></i>
              </span>
              &nbsp;&nbsp;
              <u>Save</u>
            </p>
          </div>
          <img
            className="spot-preview-img"
            style={{ width: 400 }}
            src={previewImg.url}
            alt="spot-preveiw"
          />
          <h2>Spot hosted by {Owner.firstName}</h2>
          <p className="spot-description">{description}</p>
          <div className="booking-side-card">
            <h3>${price} night</h3>
            <p>
              <span>
                <i className="fa-solid fa-star"></i>
              </span>
              {avgStarRating}&#183;<u>{numReviews} reviews</u>
            </p>
            <form className="booking-from">
              <label htmlFor="check-in-date">CHECK-IN</label>
              <input type="date" />
              <label htmlFor="check-out-date">CHECK-OUT</label>
              <input type="date" />
              <label htmlFor="guest-num">GUEST</label>
              <input type="text" />
              <button>Reserve</button>
            </form>
            <p>You won't be charged yet</p>
            <p>${price} * n nights</p>
            <p>total amount</p>
          </div>

          <SpotReviews
            avgStarRating={avgStarRating}
            numReviews={numReviews}
            reviewInfo={reviewInfo}
            // user={user}
            // spotId={spotId}
          />
          {/* <div className="owner-info">
            <p>{`Spot hosted by ${Owner.firstName}`}</p>
          </div> */}
        </>
      )}
    </div>
  );
};
export default SpotDetail;
