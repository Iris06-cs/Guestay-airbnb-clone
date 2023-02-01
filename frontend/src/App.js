import React, { useEffect, useState } from "react";
// import { Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import Footer from "./components/Footer";

import Navigation from "./components/Navigation";
import MainHome from "./components/MainHome";
import * as sessionActions from "./store/session";
import { Route, Switch } from "react-router-dom";

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
      <Switch>
        <Route exact path="/">
          <MainHome />
        </Route>
      </Switch>

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
