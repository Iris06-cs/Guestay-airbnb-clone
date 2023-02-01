import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { signupThunk } from "../../store/session";
import { useModal } from "../../context/Modal";

import "./SignupForm.css";

const SignupFormModal = () => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [signupLabels, setSignupLabels] = useState({
    fname: "",
    lname: "",
    email: "",
    username: "",
    password: "",
    cpassword: "",
  });
  const [redSignupLabel, setRedSignupLabel] = useState(false);
  const user = useSelector((state) => state.session.user);

  const resetInput = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setUsername("");
    setPassword("");
    setErrors([]);
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      firstName,
      lastName,
      email,
      username,
      password,
    };
    if (user) resetInput();
    if (password === confirmPassword) {
      return dispatch(signupThunk(newUser))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
            setRedSignupLabel(true);
          }
        });
    }
    return setErrors([
      "Confirm Password field must be the same as the Password field",
    ]);
  };
  const fnameLabel =
    "signupForm-label " +
    (signupLabels.fname ? "" : "hidden-signuplabel ") +
    (redSignupLabel ? "red" : "");
  const lnameLabel =
    "signupForm-label " +
    (signupLabels.lname ? "" : "hidden-signuplabel ") +
    (redSignupLabel ? "red" : "");
  const emailLabel =
    "signupForm-label " +
    (signupLabels.email ? "" : "hidden-signuplabel ") +
    (redSignupLabel ? "red" : "");
  const unameLabel =
    "signupForm-label " +
    (signupLabels.username ? "" : "hidden-signuplabel ") +
    (redSignupLabel ? "red" : "");
  const pswLabel =
    "signupForm-label " +
    (signupLabels.password ? "" : "hidden-signuplabel ") +
    (redSignupLabel ? "red" : "");
  const cpswLabel =
    "signupForm-label " +
    (signupLabels.cpassword ? "" : "hidden-signuplabel ") +
    (redSignupLabel ? "red" : "");
  return (
    <div className="signup-form">
      <button onClick={closeModal} className="close-modal-button">
        <i className="fa-solid fa-xmark"></i>
      </button>
      <h1 id="signup-title">Sign Up</h1>
      <form className="signup-form" onSubmit={handleOnSubmit}>
        <div className="signup-inputarea">
          <label className={fnameLabel} htmlFor="firstname">
            Firstname
          </label>
          <input
            id="firstname"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            // required
            placeholder="First Name"
            onFocus={() =>
              setSignupLabels(
                (prev) => (prev = { ...prev, fname: "show-fname" })
              )
            }
            onBlur={() => setSignupLabels((prev) => (prev.fname = ""))}
          />
        </div>
        <div className="signup-inputarea">
          <label className={lnameLabel} htmlFor="lastname">
            Lastname
          </label>
          <input
            id="lastname"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            // required
            placeholder="Last Name"
            onFocus={() =>
              setSignupLabels(
                (prev) => (prev = { ...prev, lname: "show-lname" })
              )
            }
            onBlur={() => setSignupLabels((prev) => (prev.lname = ""))}
          />
        </div>
        <div className="signup-inputarea">
          <label className={emailLabel} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // required
            placeholder="Email"
            onFocus={() =>
              setSignupLabels(
                (prev) => (prev = { ...prev, email: "show-email" })
              )
            }
            onBlur={() => setSignupLabels((prev) => (prev.email = ""))}
          />
        </div>
        <div className="signup-inputarea">
          <label className={unameLabel} htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            // required
            placeholder="Username"
            onFocus={() =>
              setSignupLabels(
                (prev) => (prev = { ...prev, username: "show-uname" })
              )
            }
            onBlur={() => setSignupLabels((prev) => (prev.username = ""))}
          />
        </div>
        <div className="signup-inputarea">
          <label className={pswLabel} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // required
            placeholder="Password"
            onFocus={() =>
              setSignupLabels(
                (prev) => (prev = { ...prev, password: "show-psw" })
              )
            }
            onBlur={() => setSignupLabels((prev) => (prev.password = ""))}
          />
        </div>
        <div className="signup-inputarea">
          <label className={cpswLabel} htmlFor="confirm-password">
            Confirm Password{" "}
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            // required
            placeholder="Confirm Password"
            onFocus={() =>
              setSignupLabels(
                (prev) => (prev = { ...prev, cpassword: "show-cpsw" })
              )
            }
            onBlur={() => setSignupLabels((prev) => (prev.cpassword = ""))}
          />
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
        <button id="signup-submit" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};
export default SignupFormModal;
