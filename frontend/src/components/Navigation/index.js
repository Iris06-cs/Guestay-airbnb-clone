import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import logo from "../../images/logo.jpg";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

const Navigation = ({ isLoaded }) => {
  const sessionUser = useSelector((state) => state.session.user);

  let conditionalLinks;
  //   console.log(sessionUser);
  if (!sessionUser) {
    conditionalLinks = (
      <>
        <li>
          {/* <NavLink to="/signup">Signup</NavLink> */}
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
        </li>
        <li>
          {/* <NavLink to="/login">Login</NavLink> */}
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
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
