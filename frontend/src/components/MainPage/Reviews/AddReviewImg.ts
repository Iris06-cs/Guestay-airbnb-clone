import { useState } from "react";
import { useDispatch } from "react-redux";

import * as entitiesActions from "../../../store/entities";

const AddReviewImg = (props) => {
  const { id, setIsChanged } = props;
  const dispatch = useDispatch();
  const [reviewUrl, setReviewUrl] = useState("");
  const [errs, setErrs] = useState([]);

  const handleAddImg = (e) => {
    e.preventDefault();
    const reviewId = e.target.name;
    const image = { url: reviewUrl };
    setErrs([]);
    dispatch(entitiesActions.addReviewImgThunk(reviewId, image))
      .then((res) => setIsChanged((prev) => prev + 1))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrs([...data.errors]);
        }
      });
    setReviewUrl("");
  };

  return (
    <>
      <label htmlFor="imgUrl-review">Url</label>
      <input
        id="imgUrl-review"
        type="text"
        value={reviewUrl}
        onChange={(e) => setReviewUrl(e.target.value)}
      />
      <button
        className="add-review-img-btn"
        name={id}
        onClick={(e) => handleAddImg(e)}
      >
        Add Photo
      </button>
      <ul>
        {errs.length > 0 &&
          errs.map((err) => (
            <li key={err}>
              {" "}
              <span style={{ color: "red", padding: "5px" }}>
                <i className="fa-solid fa-circle-exclamation"></i>
              </span>
              {err}
            </li>
          ))}
      </ul>
    </>
  );
};
export default AddReviewImg;
