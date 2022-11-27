//Student: Hoda Masteri
import React, { useContext } from "react";
import { StateContext } from "../contexts";

import Login from "./Login";
import Register from "./Register";

// import Logout from "./Logout";   // Removing the dynamic import of Logout so I can lazy load it.
const Logout = React.lazy(() => import("./Logout")); //Lazy loading the logout component

export default function UserBar() {
  const { state } = useContext(StateContext);
  if (state.user && typeof state.user.username !== "undefined") {
    return <Logout />;
  } else {
    return (
      <>
        <Login />
        <Register />
      </>
    );
  }
}
