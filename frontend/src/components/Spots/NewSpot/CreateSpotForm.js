import React, { useState } from "react";
import "./CreateSpotForm.css";

const CreateSpotForm = ({ setIsClicked }) => {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lont, setLont] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  //   console.log("info", street, state, city);
  const handleOnChange = (e, callback) => {
    callback(e.target.value);
  };
  //click next button submit form, go to add image page
  return (
    <form className="Create-spot-form">
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
            value={lont}
            onChange={(e) => handleOnChange(e, setLont)}
          />
        </div>
      </div>
      <div className="intro-form">
        <div>
          <h2>Give your spot a name</h2>
          <textarea value={name} onChange={(e) => handleOnChange(e, setName)} />
        </div>
        <div>
          <h2>Create your description</h2>
          <p>Share some special points make your spot unique</p>
          <textarea value={description} onChange={(e) => setDescription} />
        </div>
        <div>
          <h2>Set your price</h2>
          <p>You can change it at anytime</p>
          <div>
            <button>
              <span>
                <i className="fa-solid fa-plus"></i>
              </span>
            </button>
            <input />
            <button>
              <span>
                <i className="fa-solid fa-minus"></i>
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="direct-btns">
        <button id="back-btn" onClick={(e) => setIsClicked(false)}>
          back
        </button>
        <button id="next-btn">Next</button>
      </div>
    </form>
  );
};

export default CreateSpotForm;
