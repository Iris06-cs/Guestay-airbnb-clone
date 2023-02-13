import React, { useEffect, useState } from "react";
import { NavLink, useParams, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import * as entitiesActions from "../../../store/entities";
import defaultImg from "../../../utils/handleImageError";
import demoSpotImg from "../../../images/demoSpotImg.png";
import LoginFormModal from "../../LoginFormModal";
import "./UserSpot.css";
import multipleGenerator from "../../../utils/multipleGenerator";

const UserSpot = ({ isLoaded }) => {
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
  const [spotDetail, setSpotDetail] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [userId, setIsUserId] = useState("");
  const [photoes, setPhotoes] = useState("");
  const [redirect, setRedirect] = useState(false);
  //load spot data and reload update when edit submited
  useEffect(() => {
    dispatch(entitiesActions.loadOneSpotThunk(spotId));
  }, [dispatch, spotId, isSubmited, user]);

  useEffect(() => {
    if (spot) {
      setSpotDetail({ ...spot });
    }
    if (user) setIsUserId(user.id);
  }, [spot, user]);

  useEffect(() => {
    if (spotDetail) {
      const {
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        // numReviews,
        // avgStarRating,
        SpotImages,
      } = spotDetail;
      setInputStreet(address);
      setInputCity(city);
      setInputState(state);
      setInputCountry(country);
      setInputLat(lat);
      setInputLng(lng);
      setInputName(name);
      setInputDescription(description);
      setInputPrice(Number(price));
      setOwnerId(ownerId);
      if (typeof SpotImages === "string") {
        setPhotoes(SpotImages);
      } else setPhotoes([...SpotImages]);
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
    setInputPrice((prev) => Number(prev) + 1);
  };
  const decreasePrice = (e) => {
    e.preventDefault();
    setInputPrice((prev) => Number(prev) - 1);
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
        .then((res) => {
          setIsSubmited(true);
        })
        //catch validation errors
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        })
    );
  };
  // useEffect(() => {
  //   if (ownerId && userId && userId !== ownerId) {
  //     setTimeout(() => {
  //       setRedirect(true);
  //     }, 3000);
  //   }
  //   return;
  // }, [ownerId, userId]);
  //if no user logged in ==>login page
  if (isLoaded && !user)
    return (
      <>
        <LoginFormModal />
      </>
    );

  //if login user is not owner will show message below and redirect back to home in 3 sec
  // if (isLoaded && ownerId && userId && userId !== ownerId)
  //   return (
  //     <>
  //       <h1>You do not have authorization to this page</h1>
  //       <h2>Direct back to home page</h2>
  //     </>
  //   );
  // if (isLoaded && user && redirect) return <Redirect to="/" />;
  return (
    <div className="user-spot-page">
      <div className="user-spot-title">
        <h1>Spot:{inputName}</h1>
      </div>
      {ownerId && userId === ownerId && (
        <>
          <div className="photo-section">
            <div className="photo-title">
              <h2>Photos</h2>
            </div>
            <div className="edit-phtot-btn">
              <NavLink to={`/spots/${spotId}/images`}>
                <button type="Submit" id="edit-btn-usersport">
                  Manage Photos
                </button>
              </NavLink>
            </div>
            {/* {spotDetail && (
              <div className="spot-images">
                {typeof photoes === "string"
                  ? defaultImg("", demoSpotImg, "spot-img", "spot")
                  : photoes.map((img) =>
                      defaultImg(
                        img.url,
                        demoSpotImg,
                        "spot-img",
                        "spot",
                        img.id
                      )
                    )}
              </div>
            )} */}
            {spotDetail && (
              <div className="spot-images">
                {multipleGenerator(4).map((idx) =>
                  typeof photoes === "string" ? (
                    <div key={`img${idx}`}>
                      {defaultImg("", demoSpotImg, "spot-img", "spot")}
                    </div>
                  ) : photoes[idx] ? (
                    <div key={`img${idx}`}>
                      {defaultImg(
                        photoes[idx].url,
                        demoSpotImg,
                        "spot-img",
                        "spot",
                        photoes[idx].id
                      )}
                    </div>
                  ) : (
                    <div key={`img${idx}`}>
                      {defaultImg("", demoSpotImg, "spot-img", "spot")}
                    </div>
                  )
                )}{" "}
              </div>
            )}
          </div>

          <form className="edit-spot-form" onSubmit={handleFormSubmit}>
            <div className="userSpo-detail">
              <h2>Spot basics</h2>
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
              <div id="edit-name-part">
                <h2>Give your spot a name</h2>
                <textarea
                  id="edit-spot-name"
                  value={inputName}
                  onChange={(e) => handleOnChange(e, setInputName)}
                />
                <p style={{ color: remainingChars < 0 ? "red" : "" }}>
                  {remainingChars}/50
                </p>
              </div>
              <div id="edit-spot-des">
                <h2>Create your description</h2>
                <p>Share some special points make your spot unique</p>
                <textarea
                  id="edit-spot-description"
                  value={inputDescription}
                  onChange={(e) => handleOnChange(e, setInputDescription)}
                />
              </div>
              <div id="edit-spot-price">
                <h2>Set your price</h2>
                <p>You can change it at anytime</p>
                <div id="price-controller">
                  <button onClick={decreasePrice}>
                    <span>
                      <i className="fa-solid fa-minus"></i>
                    </span>
                  </button>
                  <div className="input-group">
                    <span>$</span>
                    <input
                      id="edit-price-input"
                      type="text"
                      value={Number(inputPrice)}
                      onChange={(e) => setInputPrice(e.target.value)}
                    />
                  </div>
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
      )}
    </div>
  );
};
export default UserSpot;
