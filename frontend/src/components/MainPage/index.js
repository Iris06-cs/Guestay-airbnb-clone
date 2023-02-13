import React from "react";
import { Route, Switch } from "react-router-dom";
import AllSpots from "./AllSpots";
import CurrentUserSpots from "./CurrentUserSpots";
import AddSpotPhoto from "./SpotImages";
import NewSpot from "./NewSpot";
import "./MainPage.css";
// import UpdateSpotForm from "./UpdateSpot/UpdateSpotForm";
import SpotDetail from "./SpotDetail";
// import SpotReviews from "../Reviews/SpotReviews";
import CreateSpotForm from "./NewSpot/CreateSpotForm";
import PageNotFound from "./PageNotFound";
import Reviews from "./Reviews";
import UpdateUserReview from "./Reviews/UpdateUserReview";
import UserSpot from "./CurrentUserSpots/UserSpot";
const MainPage = ({ isLoaded, updatedSpots }) => {
  return (
    <div className="main-page">
      <Switch>
        {/* all spots no auth require */}
        <Route exact path="/">
          {/* <AllSpots updatedSpots={updatedSpots} /> */}
          <AllSpots />
        </Route>
        {/* switch to hosting--all spots of current user */}
        <Route exact path="/hosting/spots">
          <CurrentUserSpots isLoaded={isLoaded} />
        </Route>
        <Route exact path="/hosting/spots/new">
          <NewSpot isLoaded={isLoaded} />
        </Route>
        <Route exact path="/hosting/spots/new/started">
          <CreateSpotForm isLoaded={isLoaded} />
        </Route>
        {/* <Route exact path="/hosting/spots/:spotId/edit">
          <UpdateSpotForm isLoaded={isLoaded} />
        </Route> */}
        <Route exact path="/hosting/spots/:spotId/details">
          <UserSpot isLoaded={isLoaded} />
        </Route>
        {/* <Route exact path="/user/reviews/:reviewId/edit">
          <UpdateUserReview isLoaded={isLoaded} />
        </Route> */}
        <Route exact path="/spots/:spotId/images">
          <AddSpotPhoto isLoaded={isLoaded} />
        </Route>
        <Route exact path="/spots/:spotId">
          <SpotDetail isLoaded={isLoaded} />
        </Route>
        <Route exact path={"/spots/:spotId/reviews/new"}>
          <Reviews isLoaded={isLoaded} />
        </Route>
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
    </div>
  );
};
export default MainPage;
