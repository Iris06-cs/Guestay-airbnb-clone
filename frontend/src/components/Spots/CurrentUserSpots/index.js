//get spots by owner id
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";

import * as spotsActions from "../../../store/spots";
import "./CurrentUserSpots.css";

const CurrentUserSpots = ({ isLoaded }) => {
  // const CurrentUserSpots = ({ isLogedIn }) => {
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const spots = useSelector((state) => state.spotsState.spots);
  // console.log(user, isLoaded);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(spotsActions.loadOwnerSpots())
      .then()
      .catch(async (res) => {
        history.push("/");
      });
  }, [dispatch, history]);
  const handleDelete = (e) => {
    e.preventDefault();
  };
  const handleEdit = (e) => {
    e.preventDefault();
  };

  return (
    <ul className="owner-spots">
      {spots && isLoaded && (
        // {spots && isLogedIn && (
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
              <button onClick={handleEdit} className="edit-spot-btn">
                Edit
              </button>
              <button onClick={handleDelete} className="delete-spot-btn">
                Delete
              </button>
            </li>
          ))}
        </>
      )}
      {!user && isLoaded && <Redirect to="/" />}
      {/* {!user && isLogedIn && <Redirect to="/" />} */}
    </ul>
  );
};
export default CurrentUserSpots;
