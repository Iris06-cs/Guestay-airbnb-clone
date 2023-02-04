import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";

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
            <NavLink
              key={spot.id}
              to={`/spots/${spot.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <li className="spot-photo-card">
                <img
                  className="spot-photo-img"
                  src={spot.previewImage}
                  alt="spot"
                  click
                />
                <div className="spot-info">
                  <p className="address">{`${spot.city},${spot.state}`}</p>
                  <p className="rating">
                    <span>
                      <i className="fa-solid fa-star"></i>
                    </span>
                    {spot.avgRating === "Spot has no review yet"
                      ? "New"
                      : spot.avgRating}
                  </p>
                  <p className="price">{`$${spot.price} night`}</p>
                </div>
              </li>
            </NavLink>
          ))}
      </ul>
    </>
  );
};

export default AllSpots;
