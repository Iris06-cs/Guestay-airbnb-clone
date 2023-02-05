import React, { useState } from "react";
import { NavLink } from "react-router-dom";
const SwichHostButton = () => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const hostBtnClass = "hosting-button " + (isMouseOver ? "mouseover" : "");
  return (
    <button
      className={hostBtnClass}
      onMouseOver={(e) => setIsMouseOver(true)}
      onMouseOut={(e) => setIsMouseOver(false)}
    >
      <NavLink
        style={({ isActive }) => ({
          textDecoration: "none",
          color: isActive ? "#484848" : "#484848",
        })}
        to="/hosting/spots"
      >
        Switch to hosting
      </NavLink>
    </button>
  );
};
export default SwichHostButton;
