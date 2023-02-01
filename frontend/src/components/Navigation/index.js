import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import logo from "../../images/logo1.jpg";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector((state) => state.session.user);
  const [hostSwitch, setHostSwitch] = useState(false);
  const hostBtnClass = "hosting-button " + (hostSwitch ? "hover" : "");
  return (
    <>
      <ul className="navigation">
        <li>
          <NavLink exact to="/">
            <img id="home-logo" src={logo} alt="logo" style={{ width: 120 }} />
          </NavLink>
        </li>
        {sessionUser && (
          <li>
            <button
              className={hostBtnClass}
              onMouseOver={(e) => setHostSwitch(true)}
            >
              Switch to hosting
            </button>
          </li>
        )}
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
