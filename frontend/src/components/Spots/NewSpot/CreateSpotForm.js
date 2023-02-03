import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import * as spotsAcctions from "../../../store/spots";

const CreateSpotForm = ({ isLoaded, setIsClicked }) => {
  const history = useHistory();
  const spotState = useSelector((state) => state.spotState);
  console.log(isLoaded);
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
    setPrice((prev) => prev + 1);
  };
  const decreasePrice = (e) => {
    e.preventDefault();
    setPrice((prev) => prev - 1);
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
    dispatch(spotsAcctions.createSpotThunk(newSpot))
      .then((data) => setSpotId(data.id))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.statusCode >= 400) setErrors(data.errors);
      });
    setIsSubmited(true);
  };
  //hasn't click next or clicked next but having input validation err
  //render form
  // otherwise form successfully submitted will render add image page
  if (!isSubmited || (isSubmited && errors.length > 0))
    return (
      <>
        <form className="Create-spot-form" onSubmit={handleFormSubmit}>
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
          <div className="intro-form">
            <div>
              <h2>Give your spot a name</h2>
              <textarea
                value={name}
                onChange={(e) => handleOnChange(e, setName)}
              />
              <p>{remainingChars}/50</p>
            </div>
            <div>
              <h2>Create your description</h2>
              <p>Share some special points make your spot unique</p>
              <textarea
                value={description}
                onChange={(e) => handleOnChange(e, setDescription)}
              />
            </div>
            <div>
              <h2>Set your price</h2>
              <p>You can change it at anytime</p>
              <div>
                <button onClick={decreasePrice}>
                  <span>
                    <i className="fa-solid fa-minus"></i>
                  </span>
                </button>
                <span>{`$${price}`}</span>
                <button onClick={increasePrice}>
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
          <div className="direct-btns">
            <button id="back-btn" onClick={(e) => setIsClicked(false)}>
              back
            </button>
            {/* <NavLink to={`/spots/${id}/images`}> */}
            <button type="Submit" id="next-btn">
              Next
            </button>
            {/* </NavLink> */}
          </div>
        </form>
      </>
    );
  else {
    const submitImg = (e) => {
      e.preventDefault();
      dispatch(
        spotsAcctions.addSpotImgThunk(spotId, { url, preview: imgPreview })
      );
      history.push("/hosting/spots");
    };
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
        <button onClick={(e) => history.push("/hosting/spots")}>
          Skip and Finish
        </button>
      </>
    );
  }
};

export default CreateSpotForm;
