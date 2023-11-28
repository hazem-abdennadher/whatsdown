import React from "react";
import { theme } from "../utils";

const GlobalContext = React.createContext({
  theme,
  rooms: [],
  setRooms: () => {},
  unfiltredRooms: [],
  setUnfiltredRooms: () => {},
});

export default GlobalContext;
