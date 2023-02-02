import React from "react";
import { Route, Switch } from "react-router-dom";
import AllSpots from "./AllSpots";
import CurrentUserSpots from "./CurrentUserSpots";
import NewSpot from "./NewSpot";
const Spots = ({ isLoaded }) => {
  return (
    <Switch>
      <Route exact path="/">
        <AllSpots />
      </Route>
      <Route exact path="/hosting/spots">
        <CurrentUserSpots isLoaded={isLoaded} />
      </Route>
      <Route exact path="/hosting/spots/new">
        <NewSpot />
      </Route>
    </Switch>
  );
};
export default Spots;
