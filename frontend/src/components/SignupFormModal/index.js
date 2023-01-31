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
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors([
      "Confirm Password field must be the same as the Password field",
    ]);
  };
  return (
    <div className="signup-form">
      <button onClick={closeModal} className="close-modal-button">
        <i className="fa-solid fa-xmark"></i>
      </button>
      <h1 id="signup-title">Sign Up</h1>
      <form className="signup-form" onSubmit={handleOnSubmit}>
        {/* <label htmlFor="firstname">Firstname</label> */}
        <input
          id="firstname"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          placeholder="First Name"
        />

        {/* <label htmlFor="lastname">Lastname</label> */}
        <input
          id="lastname"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          placeholder="Last Name"
        />

        {/* <label htmlFor="email">Email</label> */}
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
        />
        {/* <label htmlFor="username">Username</label> */}
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Username"
        />
        {/* <label htmlFor="password">Password</label> */}
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
        />
        {/* <label htmlFor="confirm-password">Confirm Password </label> */}
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Confirm Password"
        />
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
