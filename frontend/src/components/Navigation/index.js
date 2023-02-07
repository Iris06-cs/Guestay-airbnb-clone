import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";

import logo from "../../images/logo1.jpg";
import ProfileButton from "./ProfileButton";
import SwichHostButton from "./SwitchHostButton";
import HostingNavLinks from "./HostingNavLinks";
import "./Navigation.css";

const Navigation = ({ isLoaded }) => {
  // const Navigation = ({ isLogedIn }) => {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div id="navigation-header">
      <ul className="navigation">
        <li>
          <NavLink exact to="/">
            <img id="home-logo" src={logo} alt="logo" style={{ width: 120 }} />
          </NavLink>
        </li>

        <li>
          {sessionUser && (
            <Route exact path={["/", "/spots/:spotId"]}>
              <SwichHostButton />
            </Route>
          )}
        </li>
        {sessionUser && (
          <li>
            <Route
              exact
              path={[
                "/hosting/",
                "/hosting/bookings",
                "/hosting/spots",
                "/hosting/spots/new",
                "/hosting/spots/:spotId/edit",
              ]}
            >
              <HostingNavLinks sessionUser={sessionUser} />
            </Route>
          </li>
        )}

        {isLoaded && (
          <li id="profile-section">
            <ProfileButton sessionUser={sessionUser} />
          </li>
        )}
      </ul>
    </div>
  );
};
export default Navigation;
