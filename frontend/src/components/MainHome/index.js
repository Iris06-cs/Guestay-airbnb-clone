import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import * as spotsActions from "../../store/spots";
import "./MainHome.css";
// list of photo cards
const MainHome = () => {
  const spots = useSelector((state) => state.spotsState.spots);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(spotsActions.loadSpots()).then((res) =>
      console.log("effect", res)
    );
  }, [dispatch]);

  return (
    <>
      <ul className="spots-cards">
        {spots &&
          spots.map((spot) => (
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
                  {spot.avgRating}
                </p>
                <p className="price">{`$${spot.price} night`}</p>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
};

export default MainHome;
