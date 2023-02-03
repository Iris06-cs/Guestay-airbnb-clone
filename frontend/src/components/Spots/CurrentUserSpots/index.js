//get spots by owner id
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";

import * as spotsActions from "../../../store/spots";
import DeleteSpotButton from "./DeleteSpotButton";
import UpdateSpot from "../UpdateSpot";
import "./CurrentUserSpots.css";

const CurrentUserSpots = ({ isLoaded }) => {
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const spots = useSelector((state) => Object.values(state.spotsState.spots));
  const spstate = useSelector((state) => state.spotsState);
  console.log(spstate);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(spotsActions.loadOwnerSpots())
      .then()
      .catch(async (res) => {
        history.push("/");
      });
  }, [dispatch, history]);
  console.log("spots", spots);
  return (
    <ul className="owner-spots">
      {spots && isLoaded && (
        <>
          <li className="owner-spot-column">
            <p>Spot</p>
            <p></p>
            <p>Spot Address</p>
            <p className="align-right">Modify Spot</p>
            <p className="align-right">Delete Spot</p>
          </li>
          {spots.map(({ id, name, address, city, state, previewImage }) => (
            <li className="owner-spot-list" key={id}>
              <img
                className="owner-spot-img"
                style={{ width: 50, height: 50 }}
                src={previewImage}
                alt="owner-spot"
              />
              <p className="owner-spot-name">{name}</p>
              <p className="owner-spot-address">{`${address},${city},${state}`}</p>
              <UpdateSpot spotId={id} />
              <DeleteSpotButton spotId={id} />
            </li>
          ))}
        </>
      )}
      {!user && isLoaded && <Redirect to="/" />}
    </ul>
  );
};
export default CurrentUserSpots;
