import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";

import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import SignupFormModal from "../SignupFormModal";
import LoginFormModal from "../LoginFormModal";
import { NavLink, useHistory } from "react-router-dom";

const ProfileButton = ({ sessionUser }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const dropdownRef = useRef();
  const [showDropdown, setShowDropdown] = useState(false);

  const openDropdown = () => {
    if (showDropdown) return;
    setShowDropdown(true);
  };
  // console.log(showDropdown);
  useEffect(() => {
    //if dropdown menu not showing
    if (!showDropdown) return;
    //dropdwon menu is open
    //close it when dropdownRef is not current event target
    const closeDropdown = (e) => {
      if (!dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("click", closeDropdown);

    return () => document.removeEventListener("click", closeDropdown);
  }, [showDropdown]);
  const closeDropdown = () => setShowDropdown(false);
  //handle logout button
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logoutThunk());
    closeDropdown();
    history.push("/");
  };
  const demoUserLogin = () => {
    const credential = {
      credential: "user1@user.io",
      password: "password1",
    };
    dispatch(sessionActions.loginThunk(credential));
    setShowDropdown(false);
  };

  const dropdownClassName =
    "profile-dropdown" + (showDropdown ? "" : " hidden");

  return (
    <>
      <button onClick={openDropdown} id="profile-button">
        <span style={{ color: "grey" }}>
          <i className="fas fa-bars"></i>
        </span>

        <span style={{ color: "white" }}>
          <i className="fa-solid fa-user"></i>
        </span>
      </button>
      <ul className={dropdownClassName} ref={dropdownRef}>
        {sessionUser ? (
          <>
            <li>{sessionUser.username}</li>
            <li>{sessionUser.email}</li>
            <li>
              <NavLink to="/reviews/current">
                <button onClick={closeDropdown}>Reviews</button>
              </NavLink>
            </li>
            <li>
              <button>Bookings</button>
            </li>
            <li>
              <button onClick={logout}>Log out</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <OpenModalMenuItem
                itemText="Log in"
                onItemClick={closeDropdown}
                modalComponent={<LoginFormModal />}
              />
            </li>
            <li>
              <OpenModalMenuItem
                itemText="Sign up"
                onItemClick={closeDropdown}
                modalComponent={<SignupFormModal />}
              />
            </li>

            <li>
              <button onClick={demoUserLogin}>DemoUser</button>
            </li>
          </>
        )}
      </ul>
    </>
  );
};
export default ProfileButton;
