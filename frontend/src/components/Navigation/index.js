import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../images/logo.jpg";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector((state) => state.session.user);

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
      <li>
        <ProfileButton sessionUser={sessionUser} />
      </li>
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
