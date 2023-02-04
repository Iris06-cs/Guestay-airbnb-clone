import React from "react";
import { Route, Switch } from "react-router-dom";
import AllSpots from "./AllSpots";
import CurrentUserSpots from "./CurrentUserSpots";
import AddSpotPhoto from "./SpotImages";
import NewSpot from "./NewSpot";
import "./Spot.css";
import UpdateSpotForm from "./UpdateSpot/UpdateSpotForm";
import SpotDetail from "./SpotDetail";
import SpotReviews from "../Reviews/SpotReviews";
const Spots = ({ isLoaded, updatedSpots }) => {
  return (
    <div className="main-spots">
      <Switch>
        <Route exact path="/">
          <AllSpots updatedSpots={updatedSpots} />
        </Route>
        <Route exact path="/hosting/spots">
          <CurrentUserSpots isLoaded={isLoaded} />
        </Route>
        <Route exact path="/hosting/spots/new">
          <NewSpot isLoaded={isLoaded} />
        </Route>
        <Route exact path="/hosting/spots/:spotId/edit">
          <UpdateSpotForm isLoaded={isLoaded} />
        </Route>
        <Route exact path="/spots/:spotId/images">
          <AddSpotPhoto isLoaded={isLoaded} />
        </Route>
        <Route exact path="/spots/:spotId">
          <SpotDetail isLoaded={isLoaded} />
        </Route>
      </Switch>
    </div>
  );
};
export default Spots;
