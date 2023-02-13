import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import * as sessionActions from "./store/session";
// import * as entitiesActions from "./store/entities";
// import Reviews from "./components/Reviews";
import MainPage from "./components/MainPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  // const [updatedSpots, setIsUpdatedSpots] = useState(false);
  // const { isLogedIn, setIsLogedIn } = useIsLogedInContext();
  useEffect(() => {
    dispatch(sessionActions.restoreSessionThunk()).then((res) => {
      setIsLoaded(true);
    });
  }, [dispatch]);
  // useEffect(() => {
  //   dispatch(entitiesActions.restoreSpots()).then((res) => {
  //     setIsUpdatedSpots(true);
  //   });
  // }, [dispatch]);
  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <MainPage isLoaded={isLoaded} />
      {/* <MainPage isLoaded={isLoaded} updatedSpots={updatedSpots} /> */}
      {/* <Reviews isLoaded={isLoaded} /> */}

      <Footer />
    </>
  );
}

export default App;
