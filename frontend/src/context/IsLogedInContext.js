import React, { createContext, useState, useContext } from "react";

const IsLogedInContext = createContext();
export const useIsLogedInContext = () => useContext(IsLogedInContext);
const IsLogedInProvider = (props) => {
  const [isLogedIn, setIsLogedIn] = useState(false);
  return (
    <IsLogedInContext.Provider value={{ isLogedIn, setIsLogedIn }}>
      {props.children}
    </IsLogedInContext.Provider>
  );
};
export default IsLogedInProvider;
