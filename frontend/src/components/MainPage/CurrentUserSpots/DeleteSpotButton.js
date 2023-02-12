import React, { useState } from "react";
import { useDispatch } from "react-redux";

import * as entitiesActions from "../../../store/entities";
const DeleteSpotButton = ({ spotId }) => {
  const dispatch = useDispatch();
  const [targetSpotId, setTargetSpotId] = useState("");
  const [cancel, setCancel] = useState(false);
  const [btnText, setBtnText] = useState("Delete");
  //click delete button,get spotId
  const handleDelete = (e) => {
    e.preventDefault();
    setTargetSpotId(e.target.name);

    if (btnText === "Delete") {
      setBtnText("Confirm");
      setCancel(true);
    }
    if (btnText === "Confirm") {
      dispatch(entitiesActions.deleteSpotThunk(targetSpotId));
      setCancel(false);
    }
  };

  return (
    <>
      {cancel && (
        <button
          onClick={(e) => {
            setCancel(false);
            setBtnText("Delete");
          }}
          className="cancel-btn"
        >
          Cancel
        </button>
      )}
      <button
        id={`delete-spot-btn${spotId}`}
        name={spotId}
        className="delete-spot-btn"
        onClick={(e) => handleDelete(e)}
      >
        {btnText}
      </button>
    </>
  );
};
export default DeleteSpotButton;
