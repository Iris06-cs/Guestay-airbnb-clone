import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import CreateSpotForm from "./CreateSpotForm";
const NewSpot = ({ isLoaded }) => {
  const [isClicked, setIsClicked] = useState(false);
  const user = useSelector((state) => state.session.user);
  //store isClicked in localStorage avovd lost state on refresh
  useEffect(() => {
    setIsClicked(JSON.parse(window.localStorage.getItem("isClicked")));
  }, [setIsClicked]);

  useEffect(() => {
    window.localStorage.setItem("isClicked", isClicked);
  }, [isClicked]);
  // const handleBtnClick = (e) => {
  //   e.preventDefault();
  //   console.log("click");
  //   return <Redirect to="/hosting/spots/new/started" />;
  // };
  return (
    <>
      {isLoaded && user && (
        <div>
          {/* {!isClicked ? (
            <div>
              <h1>It's easy to get started on Guestay</h1>
              <ul>
                <ol>
                  <h2>1 Tell us about your place</h2>
                  <p>Share some basic info.</p>
                </ol>
                <ol>
                  <h2>2 Make it stand out</h2>
                  <p>Add at least 1 photo plus a title and description</p>
                </ol>
                <ol>
                  <h2>3 Finish up and publish</h2>
                  <p>Set a price and publish your spot</p>
                </ol>
              </ul>
              <button onClick={(e) => setIsClicked(true)}>Get started</button>
            </div>
          ) : (
            <CreateSpotForm
              isLoaded={isLoaded}
              setIsClicked={setIsClicked}
              isClicked={isClicked}
            />
          )} */}

          <div>
            <h1>It's easy to get started on Guestay</h1>
            <ul>
              <ol>
                <h2>1 Tell us about your place</h2>
                <p>Share some basic info.</p>
              </ol>
              <ol>
                <h2>2 Make it stand out</h2>
                <p>Add at least 1 photo plus a title and description</p>
              </ol>
              <ol>
                <h2>3 Finish up and publish</h2>
                <p>Set a price and publish your spot</p>
              </ol>
            </ul>
            <NavLink exact to="/hosting/spots/new/started">
              <button>Get started</button>
            </NavLink>
          </div>

          {/* <CreateSpotForm
              isLoaded={isLoaded}
              setIsClicked={setIsClicked}
              isClicked={isClicked}
            /> */}
        </div>
      )}
      {!user && isLoaded && <Redirect to="/" />}
    </>
  );
};

export default NewSpot;
