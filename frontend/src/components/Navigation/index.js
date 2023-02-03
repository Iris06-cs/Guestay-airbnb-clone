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
    <>
      <ul className="navigation">
        <li>
          <NavLink exact to="/">
            <img id="home-logo" src={logo} alt="logo" style={{ width: 120 }} />
          </NavLink>
        </li>

        {sessionUser && (
          <Route exact path="/">
            <SwichHostButton />
          </Route>
        )}
        {sessionUser && (
          <Route
            exact
            path={[
              "/hosting/",
              "/hosting/bookings",
              "/hosting/spots",
              "/hosting/spots/new",
            ]}
          >
            <HostingNavLinks sessionUser={sessionUser} />
          </Route>
        )}

        {isLoaded && (
          // {isLogedIn && (
          <li id="profile-section">
            <ProfileButton sessionUser={sessionUser} />
          </li>
        )}
      </ul>
    </>
  );
};
export default Navigation;
