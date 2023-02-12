import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import * as entitiesActions from "../../../store/entities";
import defaultImg from "../../../utils/handleImageError";
import demoSpotImg from "../../../images/demoSpotImg.png";
import LoginFormModal from "../../LoginFormModal";
// import "./SpotImages.css";
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
  const [isChanged, setIsChanged] = useState(0);

  // const [owner, setOwner] = useState("");
  // const [userId, setUserId] = useState("");
  // const [reqLogin, setReqLogin] = useState(true);
  //fetch spot image
  console.log(imges, isChanged);
  useEffect(() => {
    dispatch(entitiesActions.loadOneSpotThunk(spotId)).then().catch();
    console.log("loading");
  }, [dispatch, spotId, user, isChanged]);
  //update
  useEffect(() => {
    if (spot && typeof spot.SpotImages !== "string") {
      console.log("render", spot.SpotImages);
      setImges(spot.SpotImages);

      const preview = spot.SpotImages.findLast((img) => img.preview === true);
      setSpotName(spot.name);
      // setOwner(spot.ownerId);
      if (preview) setPreviewImg(preview.url);
    }
    if (spot && typeof spot.SpotImages === "string") {
      setImges([]);
      setPreviewImg("");
    }
    // if (user) setUserId(user.id);
  }, [spot, user, isChanged]);

  const handleOnChange = (e, callback) => {
    callback(e.target.value);
  };
  const handleDelImg = (e, imgId) => {
    e.preventDefault();
    console.log("submit");
    dispatch(entitiesActions.deleteSpotImg(imgId))
      .then((res) => setIsChanged((prev) => prev + 1))
      .catch(async (res) => {
        const data = await res.json();
        // console.log(data);
      });
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
      .then((res) => setIsChanged((prev) => prev + 1))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setValidate(data.errors);
        }
      });
    // setIsChanged((prev) => prev + 1);
    setUrl("");
    setIsPreview(false);
  };

  if (isLoaded && !user) {
    return <LoginFormModal />;
  }
  //stay on the page after login???
  // if (isLoaded && owner && owner !== userId) return <Redirect to="/" />;
  return (
    <div id="edit-spot-img">
      {/* preview img section */}
      <h1>Spot:{spotName}</h1>
      <h2>Preview Image</h2>
      {defaultImg(previewImg, demoSpotImg, "detail-preview-img", "spot")}
      {/* all imges */}

      <h2>All Images</h2>
      <div id="spot-img-display">
        {imges.length > 0 &&
          imges.map((img) => (
            <div key={img.id} className="spot-img-container">
              {defaultImg(img.url, demoSpotImg, "del-spot-img", "spot")}
              <button onClick={(e) => handleDelImg(e, img.id)}>Delete</button>
            </div>
          ))}
      </div>
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
        <div>{url && <img id="new-img" src={url} alt="spot" />}</div>
        <ul className="validation-err">
          {validate.length > 0 &&
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

        <div id="lower-section">
          <label>Set As Preview Image</label>
          <input
            type="checkBox"
            onChange={(e) => setIsPreview((prev) => !prev)}
            checked={isPreview}
          />
          <button type="submit">Confirm</button>
        </div>
      </form>
      <button
        id="back-spot-btn"
        onClick={(e) => history.push(`/hosting/spots/${spotId}/details`)}
      >
        Back
      </button>
    </div>
  );
};
export default AddSpotPhoto;
