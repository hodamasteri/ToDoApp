import React from "react";

export const StateContext = React.createContext({
  state: {},
  dispatch: () => {},
});
// initialize the state with empty object, and the dispatch as a function that does nothing (when no provider is defined)
