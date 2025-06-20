import React, { useState } from "react";
import { HashRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { Login } from "./login";
import Register from "./register";
import NoMatch from "./noMatch";
import Dashboard from "./dashboard";
import Navbar from "./navbar";
import { UserContext } from "./userContext";

export default function App() {
  let [user, setUser] = useState({
    isLoggedIn: false,
    currentUserId: null,
    currentUserName: null,
  });
  return (
    <UserContext.Provider value={{ user: user, setUser: setUser }}>
      <HashRouter>
        <Navbar />
        <div className="container-fluid">
          <Routes>
            <Route path="/" exact={true} Component={Login} />
            <Route path="/dashboard" Component={Dashboard} />
            <Route path="/register" Component={Register} />
            <Route path="*" Component={NoMatch} />
          </Routes>
        </div>
      </HashRouter>
    </UserContext.Provider>
  );
}
