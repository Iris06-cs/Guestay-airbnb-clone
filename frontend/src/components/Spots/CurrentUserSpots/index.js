//get spots by owner id
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";

// import * as spotsActions from "../../../store/spotsSlice/spotsReducer";
import * as entitiesActions from "../../../store/entities";
import DeleteSpotButton from "./DeleteSpotButton";
import UpdateSpot from "../UpdateSpot";
import "./CurrentUserSpots.css";

const CurrentUserSpots = ({ isLoaded }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const spotsState = useSelector((state) => state.entities);
  // const spots = useSelector((state) => state.spotsState.spots);
  const spots = useSelector((state) => state.entities.userSpots);

  useEffect(() => {
    // dispatch(spotsActions.loadOwnerSpots())
    dispatch(entitiesActions.loadUserSpotsThunk())
      .then()
      .catch(async (res) => {
        history.push("/");
      });
  }, [dispatch, history]);

  return (
    <ul className="owner-spots">
      {isLoaded && spots && (
        <>
          <li className="owner-spot-column">
            <p>Spot</p>
            <p></p>
            <p>Spot Address</p>
            <p>Price</p>
            <p className="align-right">Modify Spot</p>
            <p className="align-right">Delete Spot</p>
          </li>
          {Object.values(spots).map(
            ({ id, name, price, address, city, state, previewImage }) => (
              <li className="owner-spot-list" key={id}>
                <img
                  className="owner-spot-img"
                  style={{ width: 50, height: 50 }}
                  src={previewImage}
                  alt="owner-spot"
                />
                <p className="owner-spot-name">{name}</p>
                <p className="owner-spot-address">{`${address},${city},${state}`}</p>
                <p className="owner-spot-price">{`$${price}`}</p>
                <UpdateSpot spotId={id} />
                <DeleteSpotButton spotId={id} />
              </li>
            )
          )}
        </>
      )}
      {!user && isLoaded && <Redirect to="/" />}
    </ul>
  );
};
export default CurrentUserSpots;
