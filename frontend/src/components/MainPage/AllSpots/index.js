import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";

import * as entitiesActions from "../../../store/entities";
import demoSpotImg from "../../../images/demoSpotImg.png";
import defaultImg from "../../../utils/handleImageError";
import "./AllSpots.css";
// list of photo cards
// const AllSpots = ({ updatedSpots }) => {
const AllSpots = () => {
  const entities = useSelector((state) => state.entities);
  const spots = entities.spots;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(entitiesActions.loadSpotsThunk());
  }, [dispatch]);
  // const handleImgOnError = (e) => {
  //   e.target.src = demoSpotImg;
  //   e.target.onerror = null;
  // };
  return (
    <>
      <ul className="spots-cards">
        {spots &&
          // updatedSpots &&
          Object.values(spots).map((spot) => (
            // <NavLink
            //   exact
            //   key={spot.id}
            //   to={`/spots/${spot.id}`}
            //   style={{ textDecoration: "none", color: "inherit" }}
            // >

            <li
              key={spot.id}
              className="spot-photo-card"
              onClick={(e) => window.open(`/spots/${spot.id}`)}
            >
              {defaultImg(
                spot.previewImage,
                demoSpotImg,
                "spot-photo-img",
                "spot"
              )}
              {/* {spot.previewImage === "Spot has no image yet" ? (
                <img
                  src={demoSpotImg}
                  alt="default"
                  className="spot-photo-img"
                />
              ) : (
                <img
                  onError={(e) => handleImgOnError(e)}
                  className="spot-photo-img"
                  src={spot.previewImage}
                  alt="spot"
                  // click
                /> */}
              {/* )} */}

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

            // </NavLink>
          ))}
      </ul>
    </>
  );
};

export default AllSpots;
