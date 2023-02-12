import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import * as entitiesActions from "../../../store/entities";
import demoSpotImg from "../../../images/demoSpotImg.png";
import "./NewSpot.css";
const CreateSpotForm = ({ isLoaded }) => {
  const history = useHistory();
  const spotState = useSelector((state) => state.entities.spot);
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(50);
  const [remainingChars, setRemainingChars] = useState(50);
  const [url, setUrl] = useState("");
  const [imgPreview, setImgPreview] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);
  const [spotId, setSpotId] = useState();
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (spotState) setSpotId(spotState.id);
  }, [spotState]);
  useEffect(() => {
    if (spotId) dispatch(entitiesActions.loadOneSpotThunk(spotId));
    // .then((res) => console.log("success all spots"))
    // .catch(async (res) => console.log(res, "all spots"));
  }, [dispatch, spotId]);
  const handleOnChange = (e, callback) => {
    callback(e.target.value);
  };

  //textarea max length
  const currentLength = name.length;
  useEffect(() => {
    const maxName = 50;
    setRemainingChars(maxName - currentLength);
  }, [currentLength]);
  //set price
  const increasePrice = (e) => {
    e.preventDefault();
    setPrice((prev) => Number(prev) + 1);
  };
  const decreasePrice = (e) => {
    e.preventDefault();
    setPrice((prev) => Number(prev) - 1);
  };
  const resetForm = () => {
    setStreet("");
    setCity("");
    setState("");
    setCountry("");
    setLat("");
    setLng("");
    setName("");
    setDescription("");
    setPrice(50);
  };
  //click next button submit form, go to add image page
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    const newSpot = {
      address: street,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    };

    dispatch(entitiesActions.createSpotThunk(newSpot))
      .then((data) => {
        setSpotId(data.id);
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.statusCode >= 400) setErrors(data.errors);
      });
    // setIsClicked(false);
    setIsSubmited(true);
    resetForm();
  };

  //hasn't click next or clicked next but having input validation err
  //render form
  // otherwise form successfully submitted will render add image page
  if (isLoaded && !user) return <Redirect to="/" />;
  if (!isSubmited || (isSubmited && errors.length > 0))
    return (
      <div id="create-new-container">
        <form className="create-spot-form" onSubmit={handleFormSubmit}>
          <div className="address-form">
            <h2>Where's your place located?</h2>
            <div>
              <label htmlFor="street">Street</label>
              <input
                id="street"
                type="text"
                placeholder="Street"
                value={street}
                onChange={(e) => handleOnChange(e, setStreet)}
              />
            </div>
            <div>
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => handleOnChange(e, setCity)}
              />
            </div>
            <div>
              <label htmlFor="state">State</label>
              <input
                id="state"
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => handleOnChange(e, setState)}
              />
            </div>
            <div>
              <label htmlFor="country">Country</label>
              <input
                id="country"
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => handleOnChange(e, setCountry)}
              />
            </div>
            <div>
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                type="text"
                placeholder="Latitude"
                value={lat}
                onChange={(e) => handleOnChange(e, setLat)}
              />
            </div>
            <div>
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                type="text"
                placeholder="Longitude"
                value={lng}
                onChange={(e) => handleOnChange(e, setLng)}
              />
            </div>
          </div>
          <div className="create-intro-form">
            <div id="set-name">
              <h2>Give your spot a name</h2>
              <textarea
                id="name-textarea"
                value={name}
                onChange={(e) => handleOnChange(e, setName)}
              />
              <p>{remainingChars}/50</p>
            </div>
            <div id="set-description">
              <h2>Create your description</h2>
              <p>Share some special points make your spot unique</p>
              <textarea
                id="description-text-area"
                value={description}
                onChange={(e) => handleOnChange(e, setDescription)}
              />
            </div>
            <div id="create-spot-price">
              <h2>Set your price</h2>
              <p>You can change it at anytime</p>
              <div id="price-changer">
                <button id="price-down" onClick={decreasePrice}>
                  <span>
                    <i className="fa-solid fa-minus"></i>
                  </span>
                </button>
                <div className="price-group">
                  <span>$</span>
                  <input
                    id="set-price-input"
                    type="text"
                    value={Number(price)}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <button id="price-up" onClick={increasePrice}>
                  <span>
                    <i className="fa-solid fa-plus"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>
                <span style={{ color: "red", padding: "5px" }}>
                  <i className="fa-solid fa-circle-exclamation"></i>
                </span>
                {error}
              </li>
            ))}
          </ul>

          <button className="direct-btns" type="Submit" id="next-btn-new">
            Next
          </button>
        </form>
        <button
          id="back-btn-new"
          onClick={(e) => history.push("/hosting/spots/new")}
        >
          back
        </button>
      </div>
    );
  else if (isLoaded && user) {
    const submitImg = (e) => {
      e.preventDefault();
      dispatch(
        entitiesActions.addSpotImgThunk(spotId, { url, preview: imgPreview })
      );
      history.push("/hosting/spots");
    };
    return (
      <div id="add-image-page">
        <h1>Add image</h1>
        <label htmlFor="new-url">Image URL</label>
        <input
          id="new-url"
          type="text"
          value={url}
          onChange={(e) => handleOnChange(e, setUrl)}
        />
        <div>{url && <img src={url} alt="spot" id="prev-new-img" />}</div>
        <ul className="validation-err">
          {errors.length > 0 &&
            errors.map((err) => (
              <li key={err}>
                <span style={{ color: "red", padding: "5px" }}>
                  <i className="fa-solid fa-circle-exclamation"></i>
                </span>
                {err === "Validation isUrl on url failed"
                  ? "Please provide a valid URL"
                  : err}
              </li>
            ))}
        </ul>
        <div id="set-preview-section">
          <label>Set As Preview Image</label>
          <input
            onError={(e) => (e.target.src = demoSpotImg)}
            type="checkBox"
            onChange={(e) => setImgPreview((prev) => !prev)}
            checked={imgPreview}
          />
          <button onClick={submitImg}>Confirm</button>
          <button onClick={(e) => history.replace("/hosting/spots")}>
            Skip and Finish
          </button>
        </div>
      </div>
    );
  }
};

export default CreateSpotForm;
