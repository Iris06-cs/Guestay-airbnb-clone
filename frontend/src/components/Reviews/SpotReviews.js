import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import * as entitiesActions from "../../store/entities";
import multipleGenerator from "../../utils/multipleGenerator";

const SpotReviews = (props) => {
  const { spotId } = useParams();
  const { avgStarRating, numReviews, reviewInfo } = props;
  const user = useSelector((state) => state.session.user);
  const reviews = Object.values(reviewInfo);
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
          <p>{user.firstName}</p>
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
          <NavLink to={`/spots/${spotId}/reviews/new`}>
            Start your review
          </NavLink>
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
                {/* modal show review  */}
              </li>
            )
          )}
        </ul>
      </div>
    </>
  );
};
export default SpotReviews;
