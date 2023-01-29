import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import * as sessionActions from "../../store/session";

const ProfileButton = ({ sessionUser }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const dropdownRef = useRef();

  const [showDropdown, setShowDropdown] = useState(false);
  const { username, email } = sessionUser;
  //handle logout button
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logoutThunk());
    history.push("/");
  };
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
  return (
    <>
      <button onClick={openDropdown}>
        <i className="fa-solid fa-user"></i>
      </button>

      {showDropdown && (
        <ul className={dropdownClassName} ref={dropdownRef}>
          <li>{username}</li>
          <li>{email}</li>
          <li>
            <button onClick={logout}>Log out</button>
          </li>
        </ul>
      )}
    </>
  );
};
export default ProfileButton;
