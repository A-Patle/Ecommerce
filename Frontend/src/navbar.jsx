import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "./userContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  let navigate = useNavigate();
  //get context
  const userContext = useContext(UserContext);
  console.log(userContext);

  let onLogoutClick = (event) => {
    event.preventDefault();

    userContext.setUser({
      ...userContext.user,
      isLoggedIn: false,
      currentUserId: null,
      currentUserName: null,
    });
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark navbar-style">
        <NavLink className="navbar-brand" to="/">
          eCommerce
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {userContext.user.isLoggedIn ? (
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to="/dashboard"
                  activeclassname="active"
                >
                  <i className="fa fa-dashboard"></i>Dashboard
                </NavLink>
              </li>
            ) : (
              ""
            )}

            {!userContext.user.isLoggedIn ? (
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Login
                </NavLink>
              </li>
            ) : (
              ""
            )}

            {!userContext.user.isLoggedIn ? (
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/register"
                  activeclassname="active"
                >
                  Register
                </NavLink>
              </li>
            ) : (
              ""
            )}

            <ul />
            {/* right box starts */}
            {userContext.user.isLoggedIn ? (
              <div style={{ marginLeft: 746 }}>
                <ul className="navbar-nav">
                  <li className="nav-item dropdown">
                    <NavLink
                      className="nav-link dropdown-toggle"
                      to="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fa fa-user-circle"></i>
                      {userContext.user.currentUserName}
                    </NavLink>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to="#"
                          onClick={onLogoutClick}
                        >
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            ) : (
              ""
            )}

            {/* right box ends */}
          </ul>
        </div>
      </nav>
    </>
  );
}
