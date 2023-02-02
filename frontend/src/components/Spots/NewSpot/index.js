import React, { useState } from "react";
import CreateSpotForm from "./CreateSpotForm";
const NewSpot = () => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div>
      {!isClicked ? (
        <div>
          <h1>It's easy to get started on Guestay</h1>
          <ul>
            <ol>
              <h2>1 Tell us about your place</h2>
              <p>Share some basic info.</p>
            </ol>
            <ol>
              <h2>2 Make it stand out</h2>
              <p>Add at least 1 photo plus a title and description</p>
            </ol>
            <ol>
              <h2>3 Finish up and publish</h2>
              <p>Set a price and publish your spot</p>
            </ol>
          </ul>
          <button onClick={(e) => setIsClicked(true)}>Get started</button>
        </div>
      ) : (
        <CreateSpotForm setIsClicked={setIsClicked} />
      )}
    </div>
  );
};

export default NewSpot;
