import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as entitiesActions from "../../../store/entities";
import demoSpotImg from "../../../images/demoSpotImg.png";
import defaultImg from "../../../utils/handleImageError";
import "./AllSpots.css";

const AllSpots = () => {
  const history = useHistory();
  const entities = useSelector((state) => state.entities);
  const spots = entities.spots;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(entitiesActions.loadSpotsThunk());
  }, [dispatch]);
  // const handleClickSpot = (e, spotId) => {
  //   dispatch(entitiesActions.loadOneSpotThunk(spotId))
  //     .then((res) => history.replace(`/spots/${spotId}`))
  //     .catch(async (res) => {
  //       // const data = await res.json();
  //       // if (data.statusCode === 404) setResErrs([data.message]);
  //     });
  // };
  return (
    <>
      <ul className="spots-cards">
        {spots &&
          Object.values(spots).map((spot) => (
            <li
              key={spot.id}
              className="spot-photo-card"
              //open each single spot on new tab
              // onClick={(e) => window.open(`/spots/${spot.id}`)}
              onClick={(e) => history.replace(`/spots/${spot.id}`)}
              // onClick={(e) => handleClickSpot(e, spot.id)}
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
