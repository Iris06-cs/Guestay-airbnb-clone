import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import * as entitiesActions from "../../../store/entities";
import demoSpotImg from "../../../images/demoSpotImg.png";
import defaultImg from "../../../utils/handleImageError";
import "./AllSpots.css";

const AllSpots = () => {
  const entities = useSelector((state) => state.entities);
  const spots = entities.spots;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(entitiesActions.loadSpotsThunk());
  }, [dispatch]);

  return (
    <>
      <ul className="spots-cards">
        {spots &&
          Object.values(spots).map((spot) => (
            <li
              key={spot.id}
              className="spot-photo-card"
              //open each single spot on new tab
              onClick={(e) => window.open(`/spots/${spot.id}`)}
            >
              {defaultImg(
                spot.previewImage,
                demoSpotImg,
                "spot-photo-img",
                "spot"
              )}

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
          ))}
      </ul>
    </>
  );
};

export default AllSpots;
