import { Switch, Route } from "react-router-dom";
import CreateReviewForm from "./CreateReviewForm";
import UserReviews from "./UserReviews";

const Reviews = () => {
  return (
    <Switch>
      <Route exact path="/reviews/current">
        <UserReviews />
      </Route>
      <Route exact path="/spots/:spotId/reviews/new">
        <CreateReviewForm />
      </Route>
    </Switch>
  );
};

export default Reviews;
