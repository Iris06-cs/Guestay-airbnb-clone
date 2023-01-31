import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import logo from "../../images/logo1.jpg";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <>
      <ul className="navigation">
        <li>
          <NavLink exact to="/">
            <img id="home-logo" src={logo} alt="logo" style={{ width: 120 }} />
          </NavLink>
        </li>

        {isLoaded && (
          <li id="profile-section">
            <ProfileButton sessionUser={sessionUser} />
          </li>
        )}
      </ul>
    </>
  );
};
export default Navigation;
