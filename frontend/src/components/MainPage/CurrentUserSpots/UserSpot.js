import React, { useEffect, useState } from "react";
import { useHistory, Redirect, NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as entitiesActions from "../../../store/entities";
import defaultImg from "../../../utils/handleImageError";
import demoSpotImg from "../../../images/demoSpotImg.png";
const UserSpot = ({ isLoaded }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const user = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.entities.spot);

  const [street, setInputStreet] = useState("");
  const [inputCity, setInputCity] = useState("");
  const [inputState, setInputState] = useState("");
  const [inputCountry, setInputCountry] = useState("");
  const [inputLat, setInputLat] = useState("");
  const [inputLng, setInputLng] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [inputPrice, setInputPrice] = useState(50);
  const [errors, setErrors] = useState([]);
  const [isSubmited, setIsSubmited] = useState(false);
  const [remainingChars, setRemainingChars] = useState(50);
  const spotProps = {};
  const [spotDetail, setSpotDetail] = useState("");
  useEffect(() => {
    dispatch(entitiesActions.loadOneSpotThunk(spotId)).then().catch();
  }, [dispatch, spotId]);
  useEffect(() => {
    if (spot) {
      //   setInputStreet(spot.address);
      //   setInputCity(spot.city);
      //   setInputState(spot.state);
      //   setInputCountry(spot.country);
      //   setInputLat(spot.lat);
      //   setInputLng(spot.lng);
      //   setInputName(spot.name);
      //   setInputDescription(spot.description);
      //   setInputPrice(Number(spot.price));
      setSpotDetail({ ...spot });
    }
  }, [spot]);

  useEffect(() => {
    if (spotDetail) {
      setInputStreet(spotDetail.address);
      setInputCity(spotDetail.city);
      setInputState(spotDetail.state);
      setInputCountry(spotDetail.country);
      setInputLat(spotDetail.lat);
      setInputLng(spotDetail.lng);
      setInputName(spotDetail.name);
      setInputDescription(spotDetail.description);
      setInputPrice(Number(spotDetail.price));
    }
  }, [spotDetail]);

  const handleOnChange = (e, callback) => {
    callback(e.target.value);
  };
  //textarea max length
  const currentLength = inputName.length;
  useEffect(() => {
    const maxName = 50;
    setRemainingChars(maxName - currentLength);
  }, [currentLength]);
  //set price
  const increasePrice = (e) => {
    e.preventDefault();
    setInputPrice((prev) => prev + 1);
  };
  const decreasePrice = (e) => {
    e.preventDefault();
    setInputPrice((prev) => prev - 1);
  };
  //click next button submit form, go to add image page
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    const newSpot = {
      address: street,
      city: inputCity,
      state: inputState,
      country: inputCountry,
      lat: inputLat,
      lng: inputLng,
      name: inputName,
      description: inputDescription,
      price: inputPrice,
    };

    return (
      dispatch(entitiesActions.editSpotThunk(spotId, newSpot))
        //if successfully return response
        .then((res) => {
          setIsSubmited(true);
          history.replace("/hosting/spots/");
        })
        //catch validation errors
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        })
    );
  };
  //no session user after loaded-->home
  if (isLoaded && !user) return <Redirect to="/" />;

  return (
    <>
      <h1>{inputName}</h1>
      <div>
        <h2>Photos</h2>
        <NavLink to={`/spots/${spotId}/images`}>
          <button type="Submit" id="next-btn">
            Edit
          </button>
        </NavLink>
        <div className="spot-imges">
          {!spotDetail &&
            typeof spotDetail.SpotImages === "string" &&
            defaultImg("", demoSpotImg, "spot-img", "spot")}
          {spotDetail &&
            spotDetail.SpotImages.map((img) =>
              defaultImg(img.url, demoSpotImg, "spot-img", "spot", img.id)
            )}
        </div>
      </div>

      <form className="Create-spot-form" onSubmit={handleFormSubmit}>
        <div className="userSpo-detail">
          <h2>Where's your place located?</h2>
          <div>
            <label htmlFor="street">Street</label>
            <input
              id="street"
              type="text"
              value={street}
              onChange={(e) => handleOnChange(e, setInputStreet)}
            />
          </div>
          <div>
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              value={inputCity}
              onChange={(e) => handleOnChange(e, setInputCity)}
            />
          </div>
          <div>
            <label htmlFor="state">State</label>
            <input
              id="state"
              type="text"
              value={inputState}
              onChange={(e) => handleOnChange(e, setInputState)}
            />
          </div>
          <div>
            <label htmlFor="country">Country</label>
            <input
              id="country"
              type="text"
              value={inputCity}
              onChange={(e) => handleOnChange(e, setInputCountry)}
            />
          </div>
          <div>
            <label htmlFor="latitude">Latitude</label>
            <input
              id="latitude"
              type="text"
              value={inputLat}
              onChange={(e) => handleOnChange(e, setInputLat)}
            />
          </div>
          <div>
            <label htmlFor="longitude">Longitude</label>
            <input
              id="longitude"
              type="text"
              value={inputLng}
              onChange={(e) => handleOnChange(e, setInputLng)}
            />
          </div>
        </div>
        <div className="intro-form">
          <div>
            <h2>Give your spot a name</h2>
            <textarea
              value={inputName}
              onChange={(e) => handleOnChange(e, setInputName)}
            />
            <p>{remainingChars}/50</p>
          </div>
          <div>
            <h2>Create your description</h2>
            <p>Share some special points make your spot unique</p>
            <textarea
              value={inputDescription}
              onChange={(e) => handleOnChange(e, setInputDescription)}
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
              <span>{`$${inputPrice}`}</span>
              <button onClick={increasePrice}>
                <span>
                  <i className="fa-solid fa-plus"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
        <ul>
          {errors.length > 0 &&
            errors.map((error, idx) => (
              <li key={idx}>
                <span style={{ color: "red", padding: "5px" }}>
                  <i className="fa-solid fa-circle-exclamation"></i>
                </span>
                {error}
              </li>
            ))}
        </ul>
        <div className="direct-btns">
          <button type="Submit" id="next-btn">
            Confirm Changes
          </button>
        </div>
      </form>
      <NavLink to="/hosting/spots">
        <button id="back-btn">back</button>
      </NavLink>
    </>
  );
};
export default UserSpot;
