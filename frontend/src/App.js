import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import Spots from "./components/Spots";
import * as sessionActions from "./store/session";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  // const { isLogedIn, setIsLogedIn } = useIsLogedInContext();
  useEffect(() => {
    dispatch(sessionActions.restoreSessionThunk()).then((res) => {
      setIsLoaded(true);
      // setIsLogedIn(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <Spots isLoaded={isLoaded} />

      <Footer />
    </>
  );
}

export default App;
