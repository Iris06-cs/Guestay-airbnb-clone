import React from "react";
import { Route, Switch } from "react-router-dom";
import AllSpots from "./AllSpots";
import CurrentUserSpots from "./CurrentUserSpots";
import AddSpotPhoto from "./SpotImages";
import NewSpot from "./NewSpot";
import "./Spot.css";
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
        <NewSpot isLoaded={isLoaded} />
      </Route>
      <Route path="/spots/:spotId/images">
        <AddSpotPhoto />
      </Route>
    </Switch>
  );
};
export default Spots;
