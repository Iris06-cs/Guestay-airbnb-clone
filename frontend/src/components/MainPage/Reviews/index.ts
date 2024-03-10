import { Switch, Route } from "react-router-dom";
import CreateReviewForm from "./CreateReviewForm";
import UserReviews from "./UserReviews";
import "./Reviews.css";
const Reviews = ({ isLoaded }) => {
  return (
    <Switch>
      <Route exact path="/reviews/current">
        <UserReviews isLoaded={isLoaded} />
      </Route>
      <Route exact path="/spots/:spotId/reviews/new">
        <CreateReviewForm isLoaded={isLoaded} />
      </Route>
    </Switch>
  );
};

export default Reviews;
