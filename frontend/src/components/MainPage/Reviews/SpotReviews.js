import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import * as entitiesActions from "../../../store/entities";
import defaultImg from "../../../utils/handleImageError";
import multipleGenerator from "../../../utils/multipleGenerator";
import demoSpotImg from "../../../images/demoSpotImg.png";
const SpotReviews = (props) => {
  const { spotId } = useParams();
  const { avgStarRating, numReviews, reviewInfo } = props;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const reviews = Object.values(reviewInfo);
  const spot = useSelector((state) => state.entities.spot);
  useEffect(() => {
    dispatch(entitiesActions.loadOneSpotThunk(spotId))
      .then()
      .catch(async (res) => {
        const data = await res.json();
      });
  }, [dispatch, spotId]);
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
  // console.log(reviews);
  return (
    <>
      <div className="spot-reviews">
        <p>
          <span>
            <i className="fa-solid fa-star"></i>
          </span>
          {avgStarRating === "Spot has no review yet" ? "New" : avgStarRating}
          &#183;<u>{numReviews} reviews</u>
        </p>
        <div className="add-review-link">
          {user && <p>{user.firstName}</p>}
          <ul>
            {multipleGenerator(5).map((num) => (
              <li key={num}>
                <label>
                  <span style={{ color: "white", backgroundColor: "grey" }}>
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
          {user && user.id !== spot.ownerId && (
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
              spotId,
              review,
              stars,
              createdAt,
              updatedAt,
              User,
              ReviewImages,
            }) => (
              <li key={id}>
                <p>{User.firstName}</p>
                <p>
                  {converData(updatedAt).month} &nbsp;&nbsp;
                  {converData(updatedAt).year}
                </p>
                <p>{review}</p>

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
              </li>
            )
          )}
        </ul>
      </div>
    </>
  );
};
export default SpotReviews;
