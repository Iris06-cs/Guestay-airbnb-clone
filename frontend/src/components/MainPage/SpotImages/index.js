import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useHistory, Redirect, NavLink } from "react-router-dom";
// import * as spotsActions from "../../../store/spotsSlice/spotsReducer";
import * as entitiesActions from "../../../store/entities";
const AddSpotPhoto = ({ isLoaded }) => {
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const { spotId } = useParams();
  const [url, setUrl] = useState("");
  const [imgPreview, setImgPreview] = useState(false);

  const handleOnChange = (e, callback) => {
    callback(e.target.value);
  };
  const submitImg = (e) => {
    e.preventDefault();
    // dispatch(
    //   spotsActions.addSpotImgThunk(spotId, { url, preview: imgPreview })
    // );
    dispatch(
      entitiesActions.addSpotImgThunk(spotId, { url, preview: imgPreview })
    );
    history.replace("/hosting/spots");
  };
  if (isLoaded && !user) return <Redirect to="/" />;

  return (
    <>
      <h1>Add image</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => handleOnChange(e, setUrl)}
      />
      <div>{url && <img src={url} alt="spot" />}</div>
      <label>Set As Preview Image</label>
      <input
        type="checkBox"
        onChange={(e) => setImgPreview((prev) => !prev)}
        checked={imgPreview}
      />
      <button onClick={submitImg}>Confirm</button>
    </>
  );
};
export default AddSpotPhoto;
