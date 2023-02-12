import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect, useHistory } from "react-router-dom";
import multipleGenerator from "../../../utils/multipleGenerator";
import * as entitiesActions from "../../../store/entities";
import "./Reviews.css";
//api call post /api/spots/:spotId/reviews
//cannot submit unless choose star & have review
const CreateReviewForm = ({ isLoaded }) => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.entities.spot);
  const [starRate, setStarRate] = useState(0);
  const [reviewInput, setReviewInput] = useState("");
  const [resErr, setResErrors] = useState([]);
  const [remainingChars, setRemainingChars] = useState(255);
  const currentReviewLen = reviewInput.length;

  useEffect(() => {
    const maxReview = 255;
    setRemainingChars(maxReview - currentReviewLen);
  }, [currentReviewLen]);
  useEffect(() => {
    dispatch(entitiesActions.loadOneSpotThunk(spotId));
  }, [dispatch, spotId]);

  const rateScale = ["Poor", "Fail", "OK", "Good", "Great"];
  const handleRateSubmit = (e) => {
    e.preventDefault();
    setResErrors([]);
    const review = { review: reviewInput, stars: starRate };
    dispatch(entitiesActions.createReviewThunk(review, spotId))
      .then((res) => {
        history.replace(`/spots/${spotId}`);
      })
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
    // history.replace(`/spots/${spotId}`);
    // console.log("submitted");
  };

  //if not loged in will redirect now
  //pop up sign in window

  if (isLoaded && !user) return <Redirect to="/" />;
  return (
    <div className="create-review-form">
      {spot && <h1>Spot:{spot.name}</h1>}
      {user && <p>User:{user.firstName}</p>}
      <form className="add-spot-review" onSubmit={handleRateSubmit}>
        <fieldset id="create-review-formarea">
          <legend>Leave your review:</legend>

          {/* choose from start */}
          <ul className="rate-description-list">
            {multipleGenerator(5, rateScale).map((el) => (
              <li key={el} className="rate-description">
                <span>{el}</span>
              </li>
            ))}
          </ul>
          <ul className="rate-stars-list">
            {multipleGenerator(5).map((idx) => (
              <li key={idx}>
                <div className="rate-stars-choice">
                  {/* <label htmlFor={`rate${idx}`} style={{ color: "grey" }}>
                    {multipleGenerator(idx).map((idx) => (
                      <span key={`icon${idx}`} style={{ color: "grey" }}>
                        <i className="fa-solid fa-star"></i>
                      </span>
                    ))}
                    <span>
                      <i className="fa-solid fa-star"></i>
                    </span>
                    <input
                      onChange={(e) => setStarRate(e.target.value)}
                      name="rating-scale"
                      id={`rate${idx}`}
                      //   style={{ WebkitAppearance: "none" }}
                      type="radio"
                      value={idx + 1}
                    ></input>
                  </label> */}
                  <label>
                    <span
                      style={{
                        color: idx + 1 <= starRate ? "black" : "#E4E3DA",
                        backgroundColor: "white",
                      }}
                    >
                      <i className="fa-solid fa-star"></i>
                    </span>
                  </label>
                  <input
                    className="rate-radio"
                    onChange={(e) => setStarRate(e.target.value)}
                    name="rate-stars"
                    type="radio"
                    value={idx + 1}
                    checked={Number(starRate) === idx + 1}
                  ></input>
                </div>
              </li>
            ))}
          </ul>

          <div className="create-review-container">
            <label id="create-review-label" htmlFor="create-textarea">
              Comment:
            </label>
            <textarea
              id="create-textarea"
              className="create-textarea"
              value={reviewInput}
              onChange={(e) => setReviewInput(e.target.value)}
            />
            <p
              style={{ color: remainingChars < 0 ? "red" : "" }}
              id="chars-left"
            >
              {remainingChars}/255
            </p>
          </div>
          <ul className="validate-errs">
            {resErr.length > 0 &&
              resErr.map((err) => (
                <li key={err}>
                  <span style={{ color: "red", padding: "5px" }}>
                    <i className="fa-solid fa-circle-exclamation"></i>
                  </span>
                  {err}
                </li>
              ))}
          </ul>
        </fieldset>

        <button id="create-review-btn" type="submit">
          Submit
        </button>
      </form>
      <button
        id="back-spotpage-btn"
        onClick={(e) => history.replace(`/spots/${spotId}`)}
      >
        Back
      </button>
    </div>
  );
};
export default CreateReviewForm;
