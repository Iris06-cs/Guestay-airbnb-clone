import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";

import demoSpotImg from "../../../images/demoSpotImg.png";
import * as entitiesActions from "../../../store/entities";
import converDate from "../../../utils/convertDate";
import defaultImg from "../../../utils/handleImageError";
import LoginFormModal from "../../LoginFormModal";
//
const UserReviews = ({ isLoaded }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.session.user);
  // console.log(user);
  const userReviews = useSelector((state) => state.entities.userReviews); //{1:{},2:{}}

  const [reviewList, setReviewList] = useState([]);
  const [isChanged, setIsChanged] = useState(0);

  const [reviewUrl, setReviewUrl] = useState("");
  const [errs, setErrs] = useState([]);
  useEffect(() => {
    dispatch(entitiesActions.loadUserReviewsThunk())
      .then()
      .catch(async (res) => {
        const data = await res.json();
      });
  }, [dispatch, isChanged]);

  useEffect(() => {
    if (userReviews) setReviewList([...Object.values(userReviews)]);
  }, [userReviews]);

  // const handleDeleteReview = (e) => {
  //   e.preventDefault();
  //   const reviewId = e.target.name;
  //   dispatch(entitiesActions.deleteReviewThunk(reviewId)).then((res) =>
  //     setIsChanged((prev) => prev + 1)
  //   );
  // };
  // const handleDeleteImg = (e) => {
  //   e.preventDefault();
  //   const imgId = e.target.name.split("-")[0];
  //   const reviewId = e.target.name.split("-")[1];

  //   dispatch(entitiesActions.deleteReviewImg(imgId, reviewId)).then((res) =>
  //     setIsChanged((prev) => prev + 1)
  //   );
  // };
  // const handleAddImg = (e) => {
  //   e.preventDefault();
  //   const reviewId = e.target.name;
  //   const image = { url: reviewUrl };
  //   setErrs([]);
  //   dispatch(entitiesActions.addReviewImgThunk(reviewId, image))
  //     .then((res) => setIsChanged((prev) => prev + 1))
  //     .catch(async (res) => {
  //       const data = await res.json();
  //       if (data && data.errors) {
  //         setErrs([...data.errors]);
  //       }
  //     });
  //   setReviewUrl("");
  // };

  if (isLoaded && !user) return <LoginFormModal />;

  return (
    <div className="user-reviews">
      <h1 id="userReview-title">Reviews by you</h1>

      {reviewList.length > 0 && (
        <ul className="user-review-list">
          {reviewList.length > 0 &&
            reviewList.map((item) => (
              <li className="review-details" key={item.id}>
                <p className="spot-name">Spot:{item.Spot.name}</p>
                <p className="review-date">
                  {converDate(item.updatedAt).month} &nbsp;&nbsp;
                  {converDate(item.updatedAt).year}
                </p>
                <p className="review-content">{item.review}</p>

                {/* <NavLink exact to={`/user/reviews/${item.id}/edit`}>
                  <button>Edit Review</button>
                </NavLink>
                <button name={item.id} onClick={handleDeleteReview}>
                  Delete Review
                </button>
                <label htmlFor="imgUrl-review">Url</label>
                <input
                  id="imgUrl-review"
                  type="text"
                  value={reviewUrl}
                  onChange={(e) => setReviewUrl(e.target.value)}
                /> */}
                {/* <ul>
                  {errs.length > 0 &&
                    errs.map((err) => (
                      <li key={err}>
                        {" "}
                        <span style={{ color: "red", padding: "5px" }}>
                          <i className="fa-solid fa-circle-exclamation"></i>
                        </span>
                        {err}
                      </li>
                    ))}
                </ul> */}
                {/* <button name={item.id} onClick={(e) => handleAddImg(e)}>
                  Add Image
                </button> */}
                {typeof item.ReviewImages === "string" && (
                  <div>
                    {defaultImg("", demoSpotImg, "review-image")}
                    <p>No Image Yet</p>
                  </div>
                )}
                {typeof item.ReviewImages !== "string" &&
                  item.ReviewImages.map((img) => (
                    // <img
                    //   onError={(e) => (e.target.src = demoSpotImg)}
                    //   key={img.id}
                    //   className="review-image"
                    //   src={img.url}
                    //   alt="review"
                    // />
                    <div key={img.id}>
                      {defaultImg(
                        img.url,
                        demoSpotImg,
                        "review-image",
                        "review",
                        img.id
                      )}
                      {/* <button
                        name={`${img.id} - ${item.id}`}
                        onClick={(e) => handleDeleteImg(e)}
                      >
                        Delete Image
                      </button> */}

                      {/* <button
                        name={item.id}
                        onClick={(e) => handleAddImg(e, img.id, img)}
                      >
                        Add Image
                      </button>
                      <label htmlFor="imgUrl-review">Url</label>
                      <input
                        id="imgUrl-review"
                        type="text"
                        value={reviewUrl}
                        onChange={(e) => setReviewUrl(e.target.value)}
                      /> */}
                    </div>
                  ))}
                <NavLink to={`/spots/${item.Spot.id}`}>Go to Spot</NavLink>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
export default UserReviews;
