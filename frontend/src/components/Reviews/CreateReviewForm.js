import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams, Redirect, useHistory } from "react-router-dom";
import multipleGenerator from "../../utils/multipleGenerator";
import * as entitiesActions from "../../store/entities";
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
  const [inputErr, setInputErr] = useState([]);
  const [resErr, setResErrors] = useState([]);
  useEffect(() => {
    dispatch(entitiesActions.loadOneSpotThunk(spotId));
  }, [dispatch, spotId]);
  //   useEffect(() => {
  //     let errs = [];
  //     if (starRate < 1) errs.push("Please select a star");
  //     setInputErr(errs);
  //   }, [setInputErr]);
  const rateScale = ["Poor", "Fail", "OK", "Good", "Great"];
  const handleRateSubmit = (e) => {
    e.preventDefault();
    const review = { review: reviewInput, stars: starRate };
    dispatch(entitiesActions.createReviewThunk(review, spotId))
      .then()
      .catch(async (res) => {
        const data = await res.json();
        setResErrors(data.errors);
        console.log(data);
      });
    console.log("submitted");
  };
  //if not loged in will redirect now
  //pop up sign in window
  console.log(resErr);
  if (isLoaded && !user) return <Redirect to="/" />;
  return (
    <>
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
      {spot && <h1>{spot.name}</h1>}
      {user && <p>{user.firstName}</p>}
      <form className="add-spot-review" onSubmit={handleRateSubmit}>
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
                    {/* {multipleGenerator(idx + 1).map((idx) => (
                      <span key={`icon${idx}`} style={{ color: "grey" }}>
                        <i className="fa-solid fa-star"></i>
                      </span> */}
                    {/* ))} */}
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
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </fieldset>
        <label>Comment</label>
        <textarea onChange={(e) => setReviewInput(e.target.value)} />
        <div>
          <button onClick={(e) => history.push(`/spots/${spotId}`)}>
            Back
          </button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </>
  );
};
export default CreateReviewForm;
