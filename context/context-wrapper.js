import React from "react";
import GlobalContext from "./context";
import { theme } from "../utils";

export default ContextWrapper = ({ children }) => {
  return (
    <GlobalContext.Provider value={{ theme }}>
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => React.useContext(GlobalContext);
export { useGlobalContext };
