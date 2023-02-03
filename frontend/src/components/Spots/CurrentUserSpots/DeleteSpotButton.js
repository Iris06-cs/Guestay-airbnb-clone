import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as spotsActions from "../../../store/spots";
const DeleteSpotButton = ({ id }) => {
  const dispatch = useDispatch();
  const [clickedDel, setClickedDel] = useState(false);
  const [targetSpotId, setTargetSpotId] = useState("");
  //click delete button,get spotId
  const handleDelete = (e) => {
    e.preventDefault();
    setTargetSpotId(e.target.name);
    setClickedDel(true);
    const currentBtn = document.getElementById(e.target.id);
    currentBtn.innerText = "Confirm";
    // console.log("click delete", e.target.name);
  };
  console.log(targetSpotId);
  //condirm delete, make delete api call,rerender page
  const handleComfirm = (e) => {
    e.preventDefault();
    dispatch(spotsActions.deleteSpotThunk(targetSpotId));
    setClickedDel(false);
    // console.log("click comfirm");
  };
  return (
    <button
      id={`btn${id}`}
      name={id}
      onClick={clickedDel ? handleComfirm : handleDelete}
      className="delete-spot-btn"
    >
      Delete
    </button>
  );
};
export default DeleteSpotButton;
