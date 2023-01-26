import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { loginThunk } from "../../store/session";

const LoginFormPage = () => {
  const dispatch = useDispatch();

  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [errors, setErrors] = useState([]);
  //validation inputs
  //if there's a session user in redux store, redirect to "/"
  if (sessionUser) {
    return <Redirect to="/" />;
  }
  const handleOnSubmit = (e) => {
    e.preventDefault();
    // setErrors([]);
    return dispatch(loginThunk({ credential, password })).catch(async (res) => {
      const data = await res.json();
      const err = [];
      if (data && data.statusCode >= 400) {
        err.push(data.message);
        setErrors(err);
      }
    });
  };
  return (
    <form onSubmit={handleOnSubmit}>
      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
      <label htmlFor="credential">username/email</label>
      <input
        id="credential"
        type="text"
        value={credential}
        onChange={(e) => setCredential(e.target.value)}
        required
      />
      <label htmlFor="password">password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default LoginFormPage;
