import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect, useHistory } from "react-router-dom";
import multipleGenerator from "../../../utils/multipleGenerator";
import * as entitiesActions from "../../../store/entities";

//display current review before edit
const UpdateUserReview = ({ isLoaded }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { reviewId } = useParams();
  const user = useSelector((state) => state.session.user);
  const reviews = useSelector((state) => state.entities.userReviews);
  const [resErr, setResErrors] = useState([]);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [spot, setSpot] = useState("");
  useEffect(() => {
    dispatch(entitiesActions.loadUserReviewsThunk());
  }, [dispatch]);
  useEffect(() => {
    if (reviews) {
      const { review, stars, Spot } = reviews[reviewId];
      setText(review);
      setSpot(Spot);
      setRating(stars);
    }
  }, [reviews, reviewId]);
  const rateScale = ["Poor", "Fail", "OK", "Good", "Great"];
  const handelEditReview = (e) => {
    e.preventDefault();
    dispatch(
      entitiesActions.editReviewThunk(reviewId, { review: text, stars: rating })
    )
      .then((res) => {
        history.replace(`/reviews/current`);
      })
      .catch(async (res) => {
        const data = await res.json();
        setResErrors(data.errors);
      });
  };

  //only login user can edit
  if (isLoaded && !user) return <Redirect to="/" />;
  return (
    <div>
      <h1>edit review page</h1>
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
      {spot && <h1>Spot {spot.name}</h1>}
      {user && <p>{user.firstName}</p>}
      <form className="edit-spot-review" onSubmit={handelEditReview}>
        <fieldset>
          <legend>Rate:</legend>

          {/* choose from start */}
          <ul>
            {multipleGenerator(5, rateScale).map((el) => (
              <li key={el}>
                <span>{el}</span>
              </li>
            ))}
            {multipleGenerator(5).map((idx) => (
              <li key={idx}>
                <div>
                  <label htmlFor={`rate${idx}`} style={{ color: "grey" }}>
                    {multipleGenerator(idx).map((idx) => (
                      <span key={`icon${idx}`} style={{ color: "grey" }}>
                        <i className="fa-solid fa-star"></i>
                      </span>
                    ))}
                    <span>
                      <i className="fa-solid fa-star"></i>
                    </span>
                    <input
                      onChange={(e) => setRating(e.target.value)}
                      name="rating-scale"
                      id={`rate${idx}`}
                      //   style={{ WebkitAppearance: "none" }}
                      type="radio"
                      value={idx + 1}
                    ></input>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </fieldset>
        <label>Comment</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      <button onClick={(e) => history.push(`/reviews/current`)}>Back</button>
    </div>
  );
};
export default UpdateUserReview;
