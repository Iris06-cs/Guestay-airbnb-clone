import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import * as entitiesActions from "../../../store/entities";
import defaultImg from "../../../utils/handleImageError";
import multipleGenerator from "../../../utils/multipleGenerator";
import demoSpotImg from "../../../images/demoSpotImg.png";
import AddReviewImg from "./AddReviewImg";
import DeleteReviewImg from "./DeleteReviewImg";
import converDate from "../../../utils/convertDate";

const SpotReviews = (props) => {
  const dispatch = useDispatch();
  // let inputRef = useRef(null);
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
  const [resErr, setResErrors] = useState([]);
  const [inputValidate, setInputValidate] = useState([]);
  // const [isClicked, setIsClicked] = useState(false);
  // useEffect(() => {
  //   dispatch(entitiesActions.loadOneSpotThunk(spotId))
  //     .then()
  //     .catch(async (res) => {});
  //   dispatch(entitiesActions.loadSpotReviewsThunk(spotId));
  // }, [dispatch, spotId, isDeleted]);
  //2023-01-31 23:38:52
  useEffect(() => {
    let err = [];
    if (reviewText.length > 255) err.push("You can only have 255 characters");
    if (reviewText.length === 0) err.push("You cannot leave comment empty");
    setInputValidate(err);
  }, [reviewText.length]);

  let reviewName = "userRate " + (clickEdit ? "" : "hidden");
  let reviewUsers;
  if (reviews) reviewUsers = reviews.map((review) => review.userId);
  const handleClickEdit = (e) => {
    e.preventDefault();
    setResErrors([]);
    setInputValidate([]);
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
    setResErrors([]);
    setInputValidate([]);
    if (editBtn === "Submit") {
      const reviewId = e.target.name.split("-")[0];
      const reviewStar = e.target.name.split("-")[1];

      const newReview = {
        review: reviewText,
        stars: rateStar ? rateStar : reviewStar,
      };

      dispatch(entitiesActions.editReviewThunk(reviewId, newReview))
        .then()
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            const errors = data.errors.map((err) => {
              if (err === "Please select star from 1 to 5") {
                return "Please select a star above.";
              } else if (err === "Validation len on review failed") {
                return "You can only have 255 characters";
              } else {
                return err;
              }
            });
            setResErrors(errors);
          }
        });
      setClickEdit(false);
      setEditBtn("Edit");
      // setIsSubmited(true);
      setIsChanged((prev) => prev + 1);
      setReviewText("");
      setRateStar(0);
      if (isFocus) setIsFocus(false);
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
          {user &&
            spot &&
            user.id !== spot.ownerId &&
            !reviewUsers.includes(user.id) && (
              <NavLink exact to={`/spots/${spotId}/reviews/new`}>
                Start your review
              </NavLink>
            )}
        </div>
        <ul className="spot-reviews-list">
          {reviews.map(
            ({
              id,
              userId,
              // spotId,
              review,
              stars,
              // createdAt,
              updatedAt,
              User,
              ReviewImages,
            }) => (
              // idx
              <li key={id} className="reviews-list">
                <p className="review-username">{User.firstName}</p>
                <p className="review-date">
                  {converDate(updatedAt).month} &nbsp;&nbsp;
                  {converDate(updatedAt).year}
                </p>
                <form
                  className="edit-review-form"
                  onSubmit={(e) => submitEdit(e)}
                >
                  <div>
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
                            checked={rateStar === num + 1 || stars === num + 1}
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
                  </div>
                  {/* <p>{review}</p> */}
                  {clickEdit && user && user.id === userId ? (
                    <>
                      <textarea
                        // ref={inputRef}
                        className="edit-textarea"
                        autoFocus
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        // defaultValue={review}
                        onFocus={(e) => handleIsFocus(e, review)}
                      />
                      <ul className="validate-errs">
                        {inputValidate.length > 0 &&
                          inputValidate.map((err) => (
                            <li key={err} className="edit-err-msg">
                              <span style={{ color: "red", padding: "5px" }}>
                                <i className="fa-solid fa-circle-exclamation"></i>
                              </span>
                              {err}
                            </li>
                          ))}
                      </ul>
                      <ul className="validate-errs">
                        {resErr.length > 0 &&
                          resErr.map((err) => (
                            <li key={err} className="edit-err-msg">
                              <span style={{ color: "red", padding: "5px" }}>
                                <i className="fa-solid fa-circle-exclamation"></i>
                              </span>
                              {err}
                            </li>
                          ))}
                      </ul>
                    </>
                  ) : (
                    <p>{review}</p>
                  )}
                  {/* <textarea value={review} onChange={editReviewText} /> */}
                  {user && user.id === userId && (
                    <div className="edit-btns">
                      <button
                        className="edit-review-btn"
                        name={`${id}-${stars}`}
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
                    </div>
                  )}
                </form>

                {/* no photo defaut img */}
                {typeof ReviewImages === "string" ? (
                  <>
                    {defaultImg(
                      ReviewImages,
                      demoSpotImg,
                      "review-image",
                      "review"
                    )}
                    {/* <button>Add Photo</button> */}
                  </>
                ) : (
                  ReviewImages.map((img) => (
                    <div key={img}>
                      {defaultImg(
                        img.url,
                        demoSpotImg,
                        "review-image",
                        "review"
                        // img.id
                      )}
                      {user && user.id === userId && (
                        <DeleteReviewImg
                          id={id}
                          imgId={img.id}
                          setIsChanged={setIsChanged}
                        />
                      )}
                    </div>
                  ))
                )}
                {user && user.id === userId && (
                  <div>
                    <AddReviewImg id={id} setIsChanged={setIsChanged} />
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
