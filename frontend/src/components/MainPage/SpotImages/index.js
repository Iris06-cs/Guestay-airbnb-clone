import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useHistory, Redirect, NavLink } from "react-router-dom";
// import * as spotsActions from "../../../store/spotsSlice/spotsReducer";
import * as entitiesActions from "../../../store/entities";
import defaultImg from "../../../utils/handleImageError";
import demoSpotImg from "../../../images/demoSpotImg.png";
const AddSpotPhoto = ({ isLoaded }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { spotId } = useParams();
  const user = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.entities.spot);

  const [url, setUrl] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [previewImg, setPreviewImg] = useState("");
  const [imges, setImges] = useState("");
  const [spotName, setSpotName] = useState("");
  const [validate, setValidate] = useState([]);
  const [isadded, setIsAdded] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  //fetch spot image
  useEffect(() => {
    dispatch(entitiesActions.loadOneSpotThunk(spotId))
      .then(() => {})
      .catch(async (res) => {});
  }, [dispatch, spotId, isadded, isDeleted]);
  //update
  useEffect(() => {
    if (spot && typeof spot.SpotImages !== "string") {
      setImges([...spot.SpotImages]);
      const preview = spot.SpotImages.findLast((img) => img.preview === true);
      setSpotName(spot.name);

      if (preview) setPreviewImg(preview.url);
    }
  }, [spot]);

  const handleOnChange = (e, callback) => {
    callback(e.target.value);
  };
  const handleDelImg = (e, imgId) => {
    e.preventDefault();
    dispatch(entitiesActions.deleteSpotImg(imgId))
      .then((res) => setIsDeleted((prev) => !prev))
      .catch();
  };
  const submitImg = (e) => {
    e.preventDefault();
    setValidate([]);
    dispatch(
      entitiesActions.addSpotImgThunk(spotId, {
        url,
        preview: isPreview,
      })
    )
      .then()
      .catch(async (res) => {
        // const data = await res.json();
        // if (data && data.errors) {
        //   setValidate(data.errors);
        // }
        // console.log(typeof data.message);
      });
    setUrl("");
    setIsPreview(false);
    setIsAdded((prev) => !prev);
  };
  if (isLoaded && !user) return <Redirect to="/" />;

  return (
    <>
      {/* preview img section */}
      <h1>{spotName}</h1>
      <h2>Preview Image</h2>
      {defaultImg(previewImg, demoSpotImg, "detail-preview-img", "spot")}
      {/* all imges */}
      <h2>All Images</h2>
      {imges.length &&
        imges.map((img) => (
          <div key={img.id}>
            {defaultImg(img.url, demoSpotImg, "detail-spot-img", "spot")}
            <button onClick={(e) => handleDelImg(e, img.id)}>Delete</button>
          </div>
        ))}
      {/* add img base on id */}
      <h2>Add more images</h2>
      <form onSubmit={submitImg}>
        <label htmlFor="addImg">Image URL</label>
        <input
          id="addImg"
          type="text"
          value={url}
          onChange={(e) => handleOnChange(e, setUrl)}
        />
        <div>{url && <img src={url} alt="spot" />}</div>
        <ul className="validation-err">
          {validate &&
            validate.map((err) => (
              <li key={err}>
                <span style={{ color: "red", padding: "5px" }}>
                  <i className="fa-solid fa-circle-exclamation"></i>
                </span>{" "}
                {err === "Validation isUrl on url failed"
                  ? "Please provide a valid URL"
                  : err}
              </li>
            ))}
        </ul>

        <label>Set As Preview Image</label>
        <input
          type="checkBox"
          onChange={(e) => setIsPreview((prev) => !prev)}
          checked={isPreview}
        />
        <button type="submit">Confirm</button>
      </form>
    </>
  );
};
export default AddSpotPhoto;
