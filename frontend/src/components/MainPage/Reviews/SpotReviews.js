import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import * as entitiesActions from "../../../store/entities";
import defaultImg from "../../../utils/handleImageError";
import multipleGenerator from "../../../utils/multipleGenerator";
import demoSpotImg from "../../../images/demoSpotImg.png";
// import EditReviewSpotPage from "./EditReviewSpotPage";
const SpotReviews = (props) => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const { avgStarRating, numReviews, reviewInfo, setIsChanged } = props;

  const user = useSelector((state) => state.session.user);
  const reviews = Object.values(reviewInfo);
  const spot = useSelector((state) => state.entities.spot);
  const [reviewText, setReviewText] = useState("");
  const [rateStar, setRateStar] = useState(0);
  const [clickEdit, setClickEdit] = useState(false);
  const [editBtn, setEditBtn] = useState("Edit");
  const [isFocus, setIsFocus] = useState(false);
  // const [isDeleted, setIsDeleted] = useState(false);
  const [targetReviewId, setTargetReviewId] = useState("");
  const [cancel, setCancel] = useState(false);
  const [btnText, setBtnText] = useState("Delete");
  // useEffect(() => {
  //   dispatch(entitiesActions.loadOneSpotThunk(spotId))
  //     .then()
  //     .catch(async (res) => {});
  //   dispatch(entitiesActions.loadSpotReviewsThunk(spotId));
  // }, [dispatch, spotId, isDeleted]);
  //2023-01-31 23:38:52
  const converData = (dateStr) => {
    let year = dateStr.split("-")[0];
    let month = dateStr.split("-")[1];
    const months = {
      "01": "January",
      "02": "February",
      "03": "March",
      "04": "April",
      "05": "May",
      "06": "June",
      "07": "July",
      "08": "August",
      "09": "September",
      10: "October",
      11: "November",
      12: "December",
    };

    month = months[month];
    return { year, month };
  };
  let reviewName = "userRate " + (clickEdit ? "" : "hidden");

  const handleClickEdit = (e) => {
    e.preventDefault();
    if (editBtn === "Edit") {
      setClickEdit(true);
      setEditBtn("Submit");
    }
  };
  const handleIsFocus = (e, review) => {
    setIsFocus(true);
    setReviewText(review);
  };
  const submitEdit = (e) => {
    e.preventDefault();
    if (editBtn === "Submit") {
      const newReview = { review: reviewText, stars: rateStar };
      const reviewId = String(e.target.name);
      dispatch(entitiesActions.editReviewThunk(reviewId, newReview));
      setClickEdit(false);
      setEditBtn("Edit");
      // setIsSubmited(true);
      setIsChanged((prev) => prev + 1);
    }
  };

  const handleDeleteReview = (e) => {
    e.preventDefault();
    setTargetReviewId(e.target.name);

    if (btnText === "Delete") {
      setBtnText("Confirm");
      setCancel(true);
    }
    if (btnText === "Confirm") {
      dispatch(entitiesActions.deleteReviewThunk(targetReviewId));
      setCancel(false);
      // setIsDeleted(true);
      setIsChanged((prev) => prev + 1);
    }
  };
  return (
    <>
      <div className="spot-reviews">
        <p id="review-title">
          <span>
            <i className="fa-solid fa-star"></i>
          </span>
          {avgStarRating === "Spot has no review yet" ? "New" : avgStarRating}
          &#183;{numReviews} reviews
          {/* <u>{numReviews} reviews</u> */}
        </p>
        <div className="add-review-link">
          {user && <p>{user.firstName}</p>}
          <ul>
            {multipleGenerator(5).map((num) => (
              <li key={num} style={{ display: "inline" }}>
                <label>
                  <span style={{ color: "black", backgroundColor: "white" }}>
                    <i className="fa-solid fa-star"></i>
                  </span>
                </label>
                <input
                  style={{ WebkitAppearance: "none" }}
                  type="radio"
                ></input>
              </li>
            ))}
          </ul>
          {/* restric owner to review their own spot&& if user already has a review */}
          {user && spot && user.id !== spot.ownerId && (
            <NavLink exact to={`/spots/${spotId}/reviews/new`}>
              Start your review
            </NavLink>
          )}
        </div>
        <ul className="spot-reviews-list">
          {reviews.map(
            (
              {
                id,
                userId,
                spotId,
                review,
                stars,
                createdAt,
                updatedAt,
                User,
                ReviewImages,
              },
              idx
            ) => (
              <li key={id} className="reviews-list">
                <p>{User.firstName}</p>
                <p>
                  {converData(updatedAt).month} &nbsp;&nbsp;
                  {converData(updatedAt).year}
                </p>
                <form onSubmit={(e) => submitEdit(e)}>
                  {multipleGenerator(5).map((num) => (
                    <span
                      className="star-option"
                      key={num}
                      // style={{ display: "inline" }}
                    >
                      <label>
                        {user && user.id !== userId ? (
                          <span
                            style={{
                              color: num + 1 <= stars ? "black" : "#E4E3DA",
                              backgroundColor: "white",
                            }}
                          >
                            <i
                              // name={num + 1}
                              // onClick={(e) => setRateStar(e.target.name)}
                              className="fa-solid fa-star"
                            ></i>
                          </span>
                        ) : (
                          <span
                            style={{
                              color:
                                num + 1 <= (rateStar === 0 ? stars : rateStar)
                                  ? "black"
                                  : "#E4E3DA",
                              backgroundColor: "white",
                            }}
                          >
                            <i
                              // name={num + 1}
                              // onClick={(e) => setRateStar(e.target.name)}
                              className="fa-solid fa-star"
                            ></i>
                          </span>
                        )}
                      </label>
                      {user && user.id !== userId ? (
                        <input
                          className="starRate"
                          // onChange={(e) => setRateStar(e.target.value)}
                          name="rating-star"
                          // style={{
                          //   appearance: user && user.id === userId ? "" : "none",
                          // }}
                          type="radio"
                          value={num + 1}
                          // checked={rateStar === num + 1}
                          // value={stars}
                        ></input>
                      ) : (
                        <input
                          className={
                            user && user.id === userId
                              ? `${reviewName}`
                              : "starRate"
                          }
                          onChange={(e) => setRateStar(e.target.value)}
                          name="rating-star"
                          // style={{
                          //   appearance: user && user.id === userId ? "" : "none",
                          // }}
                          type="radio"
                          value={num + 1}
                          checked={rateStar === num + 1}
                          // value={stars}
                        ></input>
                      )}
                      {/* <input
                        className={
                          user && user.id === userId
                            ? `${reviewName}`
                            : "starRate"
                        }
                        onChange={(e) => setRateStar(e.target.value)}
                        name="rating-star"
                        // style={{
                        //   appearance: user && user.id === userId ? "" : "none",
                        // }}
                        type="radio"
                        value={num + 1}
                        checked={rateStar === num + 1}
                        // value={stars}
                      ></input> */}
                    </span>
                  ))}
                  {/* <p>{review}</p> */}
                  {clickEdit && user && user.id === userId ? (
                    <textarea
                      autoFocus
                      value={isFocus ? reviewText : review}
                      onChange={(e) => setReviewText(e.target.value)}
                      onFocus={(e) => handleIsFocus(e, review)}
                    />
                  ) : (
                    <p>{review}</p>
                  )}
                  {/* <textarea value={review} onChange={editReviewText} /> */}
                  {user && user.id === userId && (
                    <>
                      <button
                        name={id}
                        type="submit"
                        onClick={(e) =>
                          editBtn === "Edit"
                            ? handleClickEdit(e)
                            : submitEdit(e)
                        }
                      >
                        {editBtn}
                      </button>
                      <button
                        name={id}
                        className="delete-review-btn"
                        onClick={(e) => handleDeleteReview(e)}
                      >
                        {btnText}
                      </button>
                      {cancel && (
                        <button
                          name={id}
                          onClick={(e) => {
                            setCancel(false);
                            setBtnText("Delete");
                            // setIsDeleted(false);
                          }}
                          className="cancel-delete-review"
                        >
                          Cancel
                        </button>
                      )}
                    </>
                  )}
                </form>

                {/* <EditReviewSpotPage
                  userId={user.id}
                  stars={stars}
                  review={review}
                  user={user}
                /> */}
                {/* no photo defaut img */}
                {typeof ReviewImages === "string"
                  ? defaultImg(
                      ReviewImages,
                      demoSpotImg,
                      "review-image",
                      "review"
                    )
                  : ReviewImages.map((img) =>
                      defaultImg(
                        img.url,
                        demoSpotImg,
                        "review-image",
                        "review",
                        img.id
                      )
                    )}
                {user && user.id === userId && (
                  <div>
                    <button>Add Photo</button>
                    <button>Delete Photo</button>
                  </div>
                )}
              </li>
            )
          )}
        </ul>
      </div>
    </>
  );
};
export default SpotReviews;
