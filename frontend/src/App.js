import React, { useEffect, useState } from "react";
// import { Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import Footer from "./components/Footer";

import Navigation from "./components/Navigation";
import * as sessionActions from "./store/session";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreSessionThunk()).then(() =>
      setIsLoaded(true)
    );
  }, [dispatch]);
  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {/* {isLoaded && (
        <Switch> */}
      {/* <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route> */}
      {/* </Switch>
      )} */}
      <Footer />
    </>
  );
}

export default App;
