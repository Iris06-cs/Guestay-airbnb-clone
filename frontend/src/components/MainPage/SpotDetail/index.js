import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SpotReviews from "../Reviews/SpotReviews";
import demoSpotImg from "../../../images/demoSpotImg.png";
import * as entitiesActions from "../../../store/entities";
import PageNotFound from "../PageNotFound";
import defaultImg from "../../../utils/handleImageError";
import "./SpotDetail.css";
import multipleGenerator from "../../../utils/multipleGenerator";
const SpotDetail = ({ isLoaded }) => {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  const user = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.entities.spot);
  const reviews = useSelector((state) => state.entities.spotReviews);

  const [spotInfo, setSpotInfo] = useState("");
  const [reviewInfo, setReviewInfo] = useState("");
  const [resErrs, setResErrs] = useState([]);
  const {
    // id,
    // ownerId,
    // address,
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
  let otherImges = [];
  if (spotInfo.id) {
    //Spot has img
    if (typeof SpotImages !== "string") {
      //preview the last added preview==true
      previewImg = SpotImages.findLast((img) => img.preview === true);
      if (previewImg)
        otherImges = SpotImages.filter((img) => img.id !== previewImg.id);
    }

    if (!previewImg) previewImg = {};
    // console.log(typeof SpotImages, "SpotImg");
    // if (SpotImages.length && previewImg)
    //   otherImges = SpotImages.filter((img) => img.id !== previewImg.id);
  }

  useEffect(() => {
    // fetchdata(entitiesActions.loadOneSpotThunk, spotId);
    // fetchdata(entitiesActions.loadSpotReviewsThunk, spotId);
    dispatch(entitiesActions.loadOneSpotThunk(spotId))
      .then()
      .catch(async (res) => {
        const data = await res.json();
        if (data.statusCode === 404) setResErrs([data.message]);
      });
    dispatch(entitiesActions.loadSpotReviewsThunk(spotId))
      .then()
      .catch(async (res) => {
        const data = await res.json();
        if (data.statusCode === 404) setResErrs([data.message]);
      });
  }, [spotId, dispatch]);

  useEffect(() => {
    if (spot) {
      setSpotInfo({ ...spot });
    }
    if (reviews) {
      setReviewInfo({ ...reviews });
    }
  }, [spot, reviews]);

  if (resErrs.length > 0) return <PageNotFound />;
  return (
    <>
      <div className="spot-details">
        {spotInfo.id && (
          <>
            <div className="top-title">
              <div className="top-left">
                <h1 className="spot-name-title">{name}</h1>
                <p className="spot-bio">
                  <span>
                    <i className="fa-solid fa-star"></i>
                  </span>
                  {avgStarRating === "Spot has no review yet"
                    ? "New"
                    : spot.avgRating}
                  &#183;{numReviews} reviews.
                  <span>
                    <i className="fa-solid fa-medal"></i>
                  </span>
                  &#183;{`${city},${state},${country}`}
                </p>
              </div>
              {/* <div className="top-right">
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
              </div> */}
            </div>
            <div className="photo-section-main">
              {/* {defaultImg(
            previewImg.url,
            demoSpotImg,
            "spot-preview-img",
            "spot-preview"
          )} */}
              <div className="main-photo">
                <img
                  onError={(e) => (e.target.src = demoSpotImg)}
                  className="spot-preview-img"
                  // style={{ width: 400 }}
                  src={previewImg.url ? previewImg.url : ""}
                  alt="spot-preveiw"
                />
              </div>
              <div className="other-img">
                {/* {SpotImages.length &&
                  otherImges.map((img) => (
                    <div key={img.id}>
                      {defaultImg(
                        img.url,
                        demoSpotImg,
                        "detail-spot-img",
                        "spot"
                      )}
                    </div>
                  ))} */}
                {multipleGenerator(4).map((idx) =>
                  otherImges[idx] && otherImges[idx].url !== previewImg.url ? (
                    <div key={otherImges[idx].id}>
                      {defaultImg(
                        otherImges[idx].url,
                        demoSpotImg,
                        "detail-spot-img",
                        "spot"
                      )}
                    </div>
                  ) : (
                    <div key={idx}>
                      {defaultImg("", demoSpotImg, "detail-spot-img", "spot")}
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="middle-section">
              <div id="host-info">
                <h2>Spot hosted by {Owner.firstName}</h2>
              </div>
              <div id="feature">
                <p>
                  <span>
                    <i className="fa-regular fa-square-check"></i>
                  </span>
                  &nbsp;Self Checkin
                </p>
                <p>Greate Location</p>
                <p>
                  <i className="fa-solid fa-clock-rotate-left"></i> &nbsp;Free
                  cancellation for 48 hours
                </p>
              </div>
              <div className="spot-description">
                <p id="description">{description}</p>
              </div>
            </div>
            <div className="booking-side-card">
              <h3>${price} night</h3>
              <p>
                {/* <span> */}
                {/* <i className="fa-solid fa-star"></i>
                </span>
                {avgStarRating === "Spot has no review yet"
                  ? "New"
                  : spot.avgRating}
                &#183;<u>{numReviews} reviews</u> */}
                <span>
                  <i className="fa-solid fa-star"></i>
                </span>
                {avgStarRating === "Spot has no review yet"
                  ? "New"
                  : avgStarRating}
                &#183;{numReviews} reviews
              </p>
              {/* <form className="booking-from">
                <label htmlFor="check-in-date">CHECK-IN</label>
                <input type="date" />
                <label htmlFor="check-out-date">CHECK-OUT</label>
                <input type="date" />
                <label htmlFor="guest-num">GUEST</label>
                <input type="text" />
                <button>Reserve</button>
              </form> */}
              {/* <p>You won't be charged yet</p>
              <p>${price} * n nights</p>
              <p>total amount</p> */}
            </div>
          </>
        )}
      </div>
      <SpotReviews
        avgStarRating={avgStarRating}
        numReviews={numReviews}
        reviewInfo={reviewInfo}
        // ownerId={ownerId}
        // spotId={spotId}
      />
    </>
  );
};
export default SpotDetail;
