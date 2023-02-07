import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";

import demoSpotImg from "../../../images/demoSpotImg.png";
import * as entitiesActions from "../../../store/entities";
import defaultImg from "../../../utils/handleImageError";
//
const UserReviews = ({ isLoaded }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.session.user);
  const userReviews = useSelector((state) => state.entities.userReviews); //{1:{},2:{}}

  const [reviewList, setReviewList] = useState([]);
  const [isDeleted, setIsDeleted] = useState(0);
  useEffect(() => {
    dispatch(entitiesActions.loadUserReviewsThunk())
      .then()
      .catch(async (res) => {
        const data = await res.json();
      });
  }, [dispatch, isDeleted]);

  useEffect(() => {
    if (userReviews) setReviewList([...Object.values(userReviews)]);
  }, [userReviews]);

  const handleDeleteReview = (e) => {
    e.preventDefault();
    const reviewId = e.target.name;
    dispatch(entitiesActions.deleteReviewThunk(reviewId)).then((res) =>
      setIsDeleted((prev) => prev + 1)
    );
  };
  const handleDeleteImg = (e, imgId) => {
    e.preventDefault();

    dispatch(entitiesActions.deleteReviewImg(imgId)).then((res) =>
      setIsDeleted((prev) => prev + 1)
    );
  };
  // try {
  //   console.log(reviewList[0].ReviewImages);
  // } catch (err) {
  //   console.log(reviewList);
  // }

  if (isLoaded && !user) return <Redirect to="/" />;
  return (
    <div className="user-reviews">
      <h1>Reviews by you</h1>
      <h2>Past reviews you've written</h2>
      {reviewList.length > 0 && (
        <ul className="user-review-list">
          {reviewList.length > 0 &&
            reviewList.map((item) => (
              <li className="review-details" key={item.id}>
                <p className="spot-name">{item.Spot.name}</p>
                <p className="review-date">{item.updateAt}</p>
                <p className="review-content">{item.review}</p>
                {!item &&
                  typeof item.ReviewImages === "string" &&
                  defaultImg("", demoSpotImg, "review-image")}
                {typeof item.ReviewImages !== "string" &&
                  item.ReviewImages.map((img) => (
                    // <img
                    //   onError={(e) => (e.target.src = demoSpotImg)}
                    //   key={img.id}
                    //   className="review-image"
                    //   src={img.url}
                    //   alt="review"
                    // />
                    <div key={img.id}>
                      {defaultImg(
                        img.url,
                        demoSpotImg,
                        "review-image",
                        "review",
                        img.id
                      )}
                      <button onClick={(e) => handleDeleteImg(e, img.id)}>
                        Delete Image
                      </button>
                    </div>
                  ))}

                <button>Add Image</button>

                <NavLink exact to={`/user/reviews/${item.id}/edit`}>
                  <button>Edit Review</button>
                </NavLink>
                <button name={item.id} onClick={handleDeleteReview}>
                  Delete Review
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
export default UserReviews;
