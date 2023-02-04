import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// import * as spotsActions from "../../../store/spotsSlice/spotsReducer";
import * as entitiesActions from "../../../store/entities";
import "./AllSpots.css";
// list of photo cards
const AllSpots = ({ updatedSpots }) => {
  const spots = useSelector((state) => state.entities.spots);

  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(spotsActions.loadSpots());
    dispatch(entitiesActions.loadSpotsThunk());
  }, [dispatch]);

  return (
    <>
      <ul className="spots-cards">
        {spots &&
          // updatedSpots &&
          Object.values(spots).map((spot) => (
            <li key={spot.id} className="spot-photo-card">
              <img
                className="spot-photo-img"
                src={spot.previewImage}
                alt="spot"
              />
              <div className="spot-info">
                <p className="address">{`${spot.city},${spot.state}`}</p>
                <p className="rating">
                  <span>
                    <i className="fa-solid fa-star"></i>
                  </span>
                  {spot.avgRating === "Spot has no review yet"
                    ? ""
                    : spot.avgRating}
                </p>
                <p className="price">{`$${spot.price} night`}</p>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
};

export default AllSpots;
