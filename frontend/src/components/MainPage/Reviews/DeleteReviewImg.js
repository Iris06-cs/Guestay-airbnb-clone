import { useDispatch } from "react-redux";

import * as entitiesActions from "../../../store/entities";

const DeleteReviewImg = (props) => {
  const { id, imgId, setIsChanged } = props;

  const dispatch = useDispatch();

  const handleDeleteImg = (e) => {
    e.preventDefault();
    // const imgId = e.target.name.split("-")[0];
    // const reviewId = e.target.name.split("-")[1];
    // console.log(imgId, id);
    dispatch(entitiesActions.deleteReviewImg(imgId, id)).then((res) =>
      setIsChanged((prev) => prev + 1)
    );
  };
  return (
    <button className="del-review-img-btn" onClick={(e) => handleDeleteImg(e)}>
      Delete Photo
    </button>
  );
};
export default DeleteReviewImg;
