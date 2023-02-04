import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import multipleGenerator from "../../utils/multipleGenerator";
//api call post /api/spots/:spotId/reviews
//cannot submit unless choose star & have review
const CreateReviewForm = () => {
  const { spotId } = useParams();
  const user = useSelector((state) => state.session.user);
  const rateScale = ["Poor", "Fail", "OK", "Good", "Great"];
  return (
    <form className="add-spot-review">
      <p>{user.firstName}</p>
      <p>Rate</p>
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
              <label>
                <span style={{ color: "grey" }}>
                  <i className="fa-solid fa-star"></i>
                </span>
              </label>
              <input style={{ WebkitAppearance: "none" }} type="radio"></input>
            </div>
          </li>
        ))}
      </ul>

      <label>Comment</label>
      <textarea />
      <div>
        <button>Back</button>
        <button>Submit</button>
      </div>
    </form>
  );
};
export default CreateReviewForm;
