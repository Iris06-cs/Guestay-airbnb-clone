import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// import * as spotsActions from "../../../store/spotsSlice/spotsReducer";
import * as entitiesActions from "../../../store/entities";
const DeleteSpotButton = ({ spotId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [clickedDel, setClickedDel] = useState(false);
  const [targetSpotId, setTargetSpotId] = useState("");
  const spots = useSelector((state) => state.entities.userSpots);
  console.log("child", spots);
  //click delete button,get spotId
  const handleDelete = (e) => {
    e.preventDefault();
    setTargetSpotId(e.target.name);
    setClickedDel(true);
    const currentBtn = document.getElementById(e.target.id);
    currentBtn.innerText = "Confirm";
    console.log("click delete", e.target.name);
  };

  //condirm delete, make delete api call,rerender page
  const handleComfirm = (e) => {
    e.preventDefault();
    dispatch(entitiesActions.deleteSpotThunk(targetSpotId));
    setClickedDel(false);
    console.log("click comfirm");
    // history.push("/hosting/spots");
  };
  return (
    <button
      id={`delete-spot-btn${spotId}`}
      name={spotId}
      onClick={clickedDel ? handleComfirm : handleDelete}
      className="delete-spot-btn"
    >
      Delete
    </button>
  );
};
export default DeleteSpotButton;
