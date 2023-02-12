import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Redirect, useHistory } from "react-router-dom";
import demoSpotImg from "../../../images/demoSpotImg.png";

import * as entitiesActions from "../../../store/entities";
import DeleteSpotButton from "./DeleteSpotButton";
import UpdateSpot from "../UpdateSpot";
import defaultImg from "../../../utils/handleImageError";
import "./CurrentUserSpots.css";
import LoginFormModal from "../../LoginFormModal";
import authErr from "../../../utils/authErr";
const CurrentUserSpots = ({ isLoaded }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const spots = useSelector((state) => state.entities);
  const [ischanged, setIsChanged] = useState(false);
  const [reqLogin, setReqLogin] = useState(false);
  useEffect(() => {
    dispatch(entitiesActions.loadUserSpotsThunk())
      .then()
      .catch(async (res) => {
        const data = await res.json();
        // authErr(data, setReqLogin);
      });
  }, [dispatch, ischanged, user, isLoaded]);
  // useEffect(() => {
  //   if (user) setReqLogin(false);
  // }, [user]);
  //if no user logged in ==>login page, if logout-->home
  // if (isLoaded && !user)
  //   return (
  //     <>
  //       <LoginFormModal />
  //     </>
  //   );

  //if user does not have any spot
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
            <p>Rating</p>
            <p className="align-right">Delete Spot</p>
          </li>
          {Object.values(spots.userSpots).map(
            ({
              id,
              name,
              price,
              address,
              city,
              state,
              avgRating,
              previewImage,
            }) => (
              <li className="owner-spot-list" key={id}>
                {defaultImg(
                  previewImage,
                  demoSpotImg,
                  "owner-spot-img",
                  "owner-spot"
                )}
                <p className="owner-spot-name">
                  <NavLink
                    className="spot-name-link"
                    to={`/hosting/spots/${id}/details`}
                  >
                    {name}
                  </NavLink>
                </p>
                <p className="owner-spot-address">{`${address},${city},${state}`}</p>
                <p className="owner-spot-price">{`$${price}`}</p>
                {/* <UpdateSpot spotId={id} /> */}
                <p className="owner-spot-rating">
                  <span>
                    <i className="fa-solid fa-star"></i>
                  </span>
                  {avgRating === "Spot has no review yet"
                    ? "New"
                    : `${avgRating}`}
                </p>
                <DeleteSpotButton spotId={id} />
              </li>
            )
          )}
        </>
      )}
    </ul>
  );
};
export default CurrentUserSpots;
