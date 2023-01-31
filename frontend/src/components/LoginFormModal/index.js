import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { loginThunk } from "../../store/session";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

const LoginFormModal = () => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  // const sessionUser = useSelector((state) => state.session.user);

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [errors, setErrors] = useState([]);
  //validation inputs
  useEffect(() => {});
  const handleOnSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(loginThunk({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        const err = [];
        if (data && data.statusCode >= 400) {
          err.push(data.message);
          setErrors(err);
        }
      });
  };
  return (
    <div className="login-form">
      <button onClick={closeModal} className="close-modal-button">
        <i className="fa-sharp fa-solid fa-xmark"></i>
      </button>
      <h1 id="login-title">Log In</h1>
      <form className="login-form" onSubmit={handleOnSubmit}>
        {/* <label htmlFor="credential">Username/Email</label> */}
        <input
          id="credential"
          type="text"
          value={credential}
          placeholder="Username/Email"
          onChange={(e) => setCredential(e.target.value)}
          required
        />

        {/* <label htmlFor="password">Password</label> */}
        <input
          id="password"
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
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
        <button id="login-submit" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default LoginFormModal;
