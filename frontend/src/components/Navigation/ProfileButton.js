import { useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";

import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import SignupFormModal from "../SignupFormModal";
import LoginFormModal from "../LoginFormModal";

const ProfileButton = ({ sessionUser }) => {
  const dispatch = useDispatch();

  const dropdownRef = useRef();

  const [showDropdown, setShowDropdown] = useState(false);

  const openDropdown = () => {
    if (showDropdown) return;
    else setShowDropdown(true);
  };
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

  const dropdownClassName = `profile-dropdown ${
    showDropdown ? "" : "hidden-dropdown"
  }`;
  const closeDropdown = () => setShowDropdown(false);
  //handle logout button
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logoutThunk());
    closeDropdown();
  };
  let conditionalRender;
  if (!sessionUser) {
    conditionalRender = (
      <>
        <li>
          <OpenModalMenuItem
            itemText="Sign Up"
            onItemClick={closeDropdown}
            modalComponent={<SignupFormModal />}
          />
        </li>
        <li>
          <OpenModalMenuItem
            itemText="Log In"
            onItemClick={closeDropdown}
            modalComponent={<LoginFormModal />}
          />
        </li>
      </>
    );
  } else {
    const { username, email } = sessionUser;
    conditionalRender = (
      <>
        <li>{username}</li>
        <li>{email}</li>
        <li>
          <button onClick={logout}>Log out</button>
        </li>
      </>
    );
  }
  return (
    <>
      <button onClick={openDropdown}>
        <i className="fa-solid fa-user"></i>
      </button>

      {showDropdown && (
        <ul className={dropdownClassName} ref={dropdownRef}>
          {/* <li>{username}</li>
          <li>{email}</li>
          <li>
            <button onClick={logout}>Log out</button>
          </li> */}
          {conditionalRender}
        </ul>
      )}
    </>
  );
};
export default ProfileButton;
