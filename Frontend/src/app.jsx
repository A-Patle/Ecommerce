import React, { useReducer } from "react";
import { HashRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { Login } from "./login";
import Register from "./register";
import NoMatch from "./noMatch";
import Dashboard from "./dashboard";
import Navbar from "./navbar";
import { UserContext } from "./userContext";
import { Store } from "./store";
import ProductList from "./ProductList";

let initialUser = {
  isLoggedIn: false,
  currentUserId: null,
  currentUserName: null,
  currentUserRole: null,
};

//reducer : operations on "user" state
let reducer = (state, action) => {
  console.log("state and action", state, action);
  switch (action.type) {
    case "login":
      return {
        isLoggedIn: true,
        currentUserId: action.payload.currentUserId,
        currentUserName: action.payload.currentUserName,
        currentUserRole: action.payload.currentUserRole,
      };

    case "logout":
      return {
        isLoggedIn: false,
        currentUserId: null,
        currentUserName: null,
        currentUserRole: null,
      };

    default:
      return state;
  }
};
export default function App() {
  //useReducer : state + operations
  const [user, dispatch] = useReducer(reducer, initialUser);

  return (
    <UserContext.Provider
      value={{
        user: user,
        dispatch: dispatch,
      }}
    >
      <HashRouter>
        <Navbar />
        <div className="container-fluid">
          <Routes>
            <Route path="/" exact={true} Component={Login} />
            <Route path="/dashboard" Component={Dashboard} />
            <Route path="/register" Component={Register} />
            <Route path="/store" Component={Store} />
            <Route path="/products" Component={ProductList} />
            <Route path="*" Component={NoMatch} />
          </Routes>
        </div>
      </HashRouter>
    </UserContext.Provider>
  );
}
