//get reviews of current user==>loadUserReviews()
//edit review editUserReview
//if logged in,session.user.id===review.owner id
//not logged in ==>home
//delete review

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Redirect, useHistory } from "react-router-dom";
import * as entitiesActions from "../../../store/entities";
//
const UserReviews = ({ isLoaded }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const userReviews = useSelector((state) => state.entities.userReviews); //{1:{},2:{}}
  const [reviewList, setReviewList] = useState("");
  const [isDeleted, setIsDeleted] = useState(0);
  useEffect(() => {
    dispatch(entitiesActions.loadUserReviewsThunk())
      .then()
      .catch(async (res) => {
        const data = await res.json();
        console.log(data, "in UserReviews");
      });
  }, [dispatch, isDeleted]);
  useEffect(() => {
    if (userReviews) setReviewList(Object.values(userReviews));
  }, [userReviews]);
  const handleDeleteReview = (e) => {
    // e.preventDefault();
    const reviewId = e.target.name;

    dispatch(entitiesActions.deleteReviewThunk(reviewId)).then((res) =>
      setIsDeleted((prev) => prev + 1)
    );
  };
  if (isLoaded && !user) return <Redirect to="/" />;
  return (
    <div className="user-reviews">
      <h1>Reviews by you</h1>
      <h2>Past reviews you've written</h2>
      {userReviews && (
        <ul className="user-review-list">
          {reviewList.length > 0 &&
            reviewList.map((review) => (
              <li className="review-details" key={review.id}>
                <p className="spot-name">{review.Spot.name}</p>
                <p className="review-date">{review.updateAt}</p>
                <p className="review-content">{review.review}</p>
                {review.ReviewImages.length > 0 ? (
                  review.ReviewImages.map((img) => (
                    <img
                      key={img.id}
                      className="review-image"
                      src={img.url}
                      alt="review"
                    />
                  ))
                ) : (
                  <p>no review image yet</p>
                )}
                <button>+Add Image function</button>
                <NavLink exact to={`/user/reviews/${review.id}/edit`}>
                  <button>Edit</button>
                </NavLink>
                <button name={review.id} onClick={handleDeleteReview}>
                  Delete
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
export default UserReviews;
