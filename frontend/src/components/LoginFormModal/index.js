import React, { useState } from "react";

import { useDispatch } from "react-redux";

import { loginThunk } from "../../store/session";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import { NavLink } from "react-router-dom";
import SignupFormModal from "../SignupFormModal";

const LoginFormModal = () => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  // const sessionUser = useSelector((state) => state.session.user);

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginLabel, setShowLoginLabel] = useState(false);
  const [showPasswordLabel, setShowPasswordLabel] = useState(false);
  const [errors, setErrors] = useState([]);
  const [redLabel, setshowRedLabel] = useState(false);
  const handleOnSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(loginThunk({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        let err = [];
        if (data && data.statusCode === 400) {
          setErrors(data.errors);
          setshowRedLabel(true);
        } else if (data && data.statusCode === 401) {
          err.push("The Email/Username or password you entered is invalid");
          setErrors(err);
          setshowRedLabel(true);
        }
      });
  };
  const loginlabel =
    "loginForm-label " +
    (showLoginLabel ? "" : "hidden-loginlabel ") +
    (redLabel ? "red" : "");
  const passwordlabel =
    "loginForm-label " +
    (showPasswordLabel ? "" : "hidden-passwordlabel ") +
    (redLabel ? "red" : "");
  return (
    <div className="login-form">
      <button onClick={closeModal} className="close-modal-button">
        <i className="fa-sharp fa-solid fa-xmark"></i>
      </button>
      <h1 id="login-title">Log In</h1>
      <form className="login-form" onSubmit={handleOnSubmit}>
        <div id="login-inputarea">
          <div id="login-area">
            <label className={loginlabel} htmlFor="credential">
              Username/Email
            </label>
            <input
              id="credential"
              type="text"
              value={credential}
              placeholder="Username/Email"
              onChange={(e) => setCredential(e.target.value)}
              onFocus={() => setShowLoginLabel(true)}
              onBlur={() => setShowLoginLabel(false)}
            />
          </div>
          <div id="password-area">
            <label className={passwordlabel} htmlFor="password">
              Password{" "}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setShowPasswordLabel(true)}
              onBlur={() => setShowPasswordLabel(false)}
            />
          </div>
        </div>

        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>
              <span style={{ color: "red", padding: "5px" }}>
                <i className="fa-solid fa-circle-exclamation"></i>
              </span>
              {error}
            </li>
          ))}
        </ul>
        {/* <p id="signup-direction">Not a member? Sign-up</p> */}
        <button id="login-submit" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default LoginFormModal;
