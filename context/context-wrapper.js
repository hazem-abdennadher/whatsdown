import React from "react";
import GlobalContext from "./context";
import { theme } from "../utils";

export default ContextWrapper = ({ children }) => {
  const [rooms, setRooms] = React.useState([]);
  const [unfiltredRooms, setUnfiltredRooms] = React.useState([]);
  return (
    <GlobalContext.Provider
      value={{ theme, rooms, setRooms, unfiltredRooms, setUnfiltredRooms }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => React.useContext(GlobalContext);
export { useGlobalContext };
