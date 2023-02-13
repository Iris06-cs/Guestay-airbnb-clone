import React from "react";
import { useSelector } from "react-redux";
import { NavLink, Redirect, useHistory } from "react-router-dom";
import "./NewSpot.css";
import logo from "../../../images/logo2.png";
const NewSpot = ({ isLoaded }) => {
  const history = useHistory();
  const user = useSelector((state) => state.session.user);

  return (
    <>
      {isLoaded && user && (
        <div id="welcome-page">
          <div id="welcome-container">
            <h1>It's easy to get started on Guestay</h1>
            <ul>
              <ol>
                <h2>1 Tell us about your place</h2>
                <p>Share some basic info.</p>
              </ol>
              <ol>
                <h2>2 Make it stand out</h2>
                <p>Add at least 1 photo plus a title and description</p>
              </ol>
              <ol>
                <h2>3 Finish up and publish</h2>
                <p>Set a price and publish your spot</p>
              </ol>
            </ul>
            <img src={logo} alt="logo" id="logo2" />
            <div id="back-container">
              <button
                id="back-host-btn"
                onClick={(e) => history.push("/hosting/spots")}
              >
                Back
              </button>
            </div>
            <NavLink exact to="/hosting/spots/new/started">
              <button id="start-btn">Get started</button>
            </NavLink>
          </div>
        </div>
      )}
      {/* no user log in =>home */}
      {!user && isLoaded && <Redirect to="/" />}
    </>
  );
};

export default NewSpot;
