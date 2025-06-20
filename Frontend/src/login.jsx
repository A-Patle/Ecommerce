import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./userContext";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("scott@test.com");
  const [password, setPassword] = useState("Scott123");
  const userContextData = useContext(UserContext);

  const [dirty, setDirty] = useState({
    email: false,
    password: false,
  });

  const [errors, setErrors] = useState({
    email: [],
    password: [],
  });
  let [message, setMessage] = useState("");
  //executed on each render( initial and state updates)
  //   useEffect(() => {
  //     console.log(email, password);
  //   });

  //   //executed only on state updates of "email" only(and also with initial render)
  //   useEffect(() => {
  //     //validation on email
  //     if (email.indexOf("@") > 0) {
  //       //   console.log("valid");
  //     } else {
  //       //   console.log("invalid");
  //     }
  //   }, [email]);

  //   //executes only once - on initial render == componentDidMount method
  //   useEffect(() => {
  //     //ex:- load data from database
  //     document.title = "Login-eCommerce";
  //   }, []);

  //   //executes only once - on component unmounting phase = componentWillUnmount
  //   useEffect(() => {
  //     //do something
  //     return () => {
  //       console.log("component unmount");
  //       document.title = "";
  //     };
  //   }, []);

  useEffect(() => {
    validate();
  }, [email, password]);

  useEffect(() => {
    //ex:- load data from database
    document.title = "Login-eCommerce";
  }, []);
  //validate method to do validation
  let validate = () => {
    //   creating a vairiable to store errors
    let errorsData = {};

    //email
    errorsData.email = [];

    //email cannot be blank
    if (!email) {
      errorsData.email.push("Email can not be blank");
    }

    //email regex
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email) {
      if (!emailRegex.test(email)) {
        errorsData.email.push("Enter a proper email");
      }
    }

    //password
    errorsData.password = [];

    //password cannot be blank
    if (!password) {
      errorsData.password.push("Password can not be blank");
    }
    //password regex
    let passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15})/;
    if (password) {
      if (!passwordRegex.test(password)) {
        errorsData.password.push("Enter a proper password");
      }
    }

    setErrors(errorsData);
  };

  let onLoginClick = async () => {
    console.log("login clicked");
    //set all properties as dirty
    let dirtyData = dirty;
    Object.keys(dirty).forEach((control) => {
      dirtyData[control] = true;
    });
    setDirty(dirtyData);
    validate();

    if (isValid()) {
      let response = await fetch(`/users?email=${email}&password=${password}`, {
        method: "GET",
        // body: JSON.stringify(state),
        // headers: {
        //   "Content-type": "application/json",
        // },
      });
      if (response.ok) {
        let resBody = await response.json();
        if (resBody.length > 0) {
          //set glbal satte using context
          userContextData.setUser({
            ...userContextData.user,
            isLoggedIn: true,
            currentUserId: resBody[0].id,
            currentUserName: resBody[0].fullName,
          });
          //redirecting to dashboard url
          navigate("/dashboard");
        } else {
          setMessage(<span className="text-danger">Logined Failed</span>);
        }
      }
    } else {
      setMessage(
        <span className="text-danger">Unable to connect database server!!</span>
      );
    }
  };
  let isValid = () => {
    let valid = true;

    //reading all controls from 'error' state
    for (const control in errors) {
      if (errors[control].length > 0) {
        valid = false;
      }
    }
    return valid;
  };

  return (
    <div className="row">
      <div className="col-lg-5 col-md-7 mx-auto">
        <div className="card border-success shadow-lg my-2">
          <div className="card-header border-bottom border-success">
            <h4
              style={{ fontSize: "14px" }}
              className="text-success text-center"
            >
              Login
            </h4>
          </div>
          <div className="card-body border-bottom border-success">
            {/* email starts */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                className="form-control"
                placeholder="Email"
                name="email"
                id="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                onBlur={(event) => {
                  setDirty({ ...dirty, [event.target.name]: true });
                  validate();
                }}
              />
              <div className="text-danger">
                {dirty["email"] && errors["email"][0] ? errors["email"] : ""}
              </div>
            </div>
            {/* email ends */}

            {/* password starts */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                name="password"
                id="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                onBlur={(event) => {
                  setDirty({ ...dirty, [event.target.name]: true });
                  validate();
                }}
              />
              <div className="text-danger">
                {dirty["password"] && errors["password"][0]
                  ? errors["password"]
                  : ""}
              </div>
            </div>
            {/* password ends */}

            {/* footer starts */}
            <div className="card-footer text-center">
              <div className="m-1">{message}</div>
              <div>
                <button className="btn btn-primary m-2" onClick={onLoginClick}>
                  Login
                </button>
              </div>
            </div>
            {/* footer ends */}
          </div>
        </div>
      </div>
    </div>
  );
}
