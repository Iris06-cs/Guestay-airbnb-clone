import { NavLink, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import logo from "../../images/logo.jpg";
import ProfileButton from "./ProfileButton";
import * as sessionActions from "../../store/session";

const Navigation = ({ isLoaded }) => {
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logoutThunk());
    history.push("/");
  };

  let conditionalLinks;
  //   console.log(sessionUser);
  if (!sessionUser) {
    conditionalLinks = (
      <>
        <li>
          <NavLink to="/signup">Signup</NavLink>
        </li>
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
      </>
    );
  } else {
    conditionalLinks = (
      <>
        <li>
          <ProfileButton />
        </li>
        <li>
          <button onClick={logout}>Log out</button>
        </li>
      </>
    );
  }

  return (
    <ul>
      <li>
        <NavLink exact to="/">
          <img src={logo} alt="logo" style={{ width: 120 }} />
        </NavLink>
      </li>
      <li>
        <NavLink exact to="/">
          Home
        </NavLink>
      </li>
      {isLoaded && conditionalLinks}
    </ul>
  );
};
export default Navigation;
