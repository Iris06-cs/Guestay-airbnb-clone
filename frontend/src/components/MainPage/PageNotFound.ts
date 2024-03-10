import { NavLink } from "react-router-dom";

const PageNotFound = () => {
  return (
    <>
      <h1>We can't seem to find the page you're looking for</h1>
      <p>Please go to the homepage:</p>
      <NavLink exact to="/">
        Home
      </NavLink>
    </>
  );
};
export default PageNotFound;
