import { NavLink } from "react-router-dom";
import React, { useState } from "react";
const HostingNavLinks = () => {
  const [isClickedCreate, setIsClickedCreate] = useState(false);
  const setStyle = ({ isActive }) => {
    return {
      textDecoration: "none",
      color: isActive ? "#484848" : "#484848",
    };
  };
  const hostNavs = "hosting-navs ";

  return (
    <div id="hosting-nav-links">
      <NavLink className={hostNavs} style={setStyle} to="/hosting/spots">
        Spots
      </NavLink>
      <NavLink
        className={hostNavs}
        style={{
          ...setStyle,
          visibility: isClickedCreate ? "hidden" : "visible",
        }}
        to="/hosting/spots/new"
        onClick={(e) => setIsClickedCreate(true)}
      >
        Create a new spot
      </NavLink>
      <NavLink className={hostNavs} style={setStyle} to="/hosting/bookings">
        Bookings
      </NavLink>
    </div>
  );
};
export default HostingNavLinks;
