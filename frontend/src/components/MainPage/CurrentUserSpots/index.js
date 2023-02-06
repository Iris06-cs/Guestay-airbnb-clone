//get spots by owner id
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import demoSpotImg from "../../../images/demoSpotImg.png";
// import * as spotsActions from "../../../store/spotsSlice/spotsReducer";
import * as entitiesActions from "../../../store/entities";
import DeleteSpotButton from "./DeleteSpotButton";
import UpdateSpot from "../UpdateSpot";
import "./CurrentUserSpots.css";

const CurrentUserSpots = ({ isLoaded }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const spots = useSelector((state) => state.entities);

  useEffect(() => {
    dispatch(entitiesActions.loadUserSpotsThunk())
      .then()
      .catch(async (res) => {
        const data = res.json();
        // console.log(data);
        history.replace("/");
      });
  }, [dispatch, history]);
  if (isLoaded && typeof spots.userSpots === "string")
    return (
      <>
        <h1>You have not listed a spot yet</h1>
      </>
    );
  return (
    <ul className="owner-spots">
      {isLoaded && spots.userSpots && (
        <>
          <li className="owner-spot-column">
            <p>Spot</p>
            <p></p>
            <p>Spot Address</p>
            <p>Price</p>
            <p className="align-right">Modify Spot</p>
            <p className="align-right">Delete Spot</p>
          </li>
          {Object.values(spots.userSpots).map(
            ({ id, name, price, address, city, state, previewImage }) => (
              <li className="owner-spot-list" key={id}>
                {previewImage === "Spot has no image yet" ? (
                  <img
                    src={demoSpotImg}
                    alt="default"
                    className="owner-spot-img"
                    style={{ width: 50, height: 50 }}
                  />
                ) : (
                  <img
                    onError={(e) => (e.target.src = demoSpotImg)}
                    className="owner-spot-img"
                    style={{ width: 50, height: 50 }}
                    src={previewImage}
                    alt="owner-spot"
                  />
                )}
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

      {isLoaded && !user && <Redirect to="/" />}
    </ul>
  );
};
export default CurrentUserSpots;
