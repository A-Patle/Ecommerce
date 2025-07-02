import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./userContext";

export default function Register() {
  const navigate = useNavigate();
  const userContextData = useContext(UserContext);
  const myEmailRef = useRef();

  const [state, setState] = useState({
    email: "",
    password: "",
    fullName: "",
    dateOfBirth: "",
    country: "",
    gender: "",
    reciveNewsLetters: "",
  });

  const [countries] = useState([
    { id: 1, countryName: "India" },
    { id: 2, countryName: "USA" },
    { id: 3, countryName: "UK" },
    { id: 4, countryName: "Japan" },
    { id: 5, countryName: "France" },
    { id: 6, countryName: "Brazil" },
    { id: 7, countryName: "Mexico" },
    { id: 8, countryName: "Canada" },
    { id: 9, countryName: "China" },
  ]);

  const [errors, setErrors] = useState({
    email: [],
    password: [],
    fullName: [],
    dateOfBirth: [],
    country: [],
    gender: [],
    reciveNewsLetters: [],
  });

  const [dirty, setDirty] = useState({
    email: false,
    password: false,
    fullName: false,
    dateOfBirth: false,
    country: false,
    gender: false,
    reciveNewsLetters: false,
  });

  let [message, setMessage] = useState("");

  //validate method to do validation
  let validate = () => {
    let errorsData = {};

    //email
    errorsData.email = [];

    //email cannit be blank
    if (!state.email) {
      errorsData.email.push("Email can not be blank");
    }

    //email regex
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (state.email) {
      if (!emailRegex.test(state.email)) {
        errorsData.email.push("Enter a proper email");
      }
    }

    //password
    errorsData.password = [];

    //password cannot be blank
    if (!state.password) {
      errorsData.password.push("Password can not be blank");
    }
    //password regex
    let passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15})/;
    if (state.password) {
      if (!passwordRegex.test(state.password)) {
        errorsData.password.push("Enter a proper password");
      }
    }

    //fullName
    errorsData.fullName = [];

    //fullName cannot be blank
    if (!state.fullName) {
      errorsData.fullName.push("fullName can not be blank");
    }

    //dateOfBirth
    errorsData.dateOfBirth = [];

    //dateOfBirth cannot be blank
    if (!state.dateOfBirth) {
      errorsData.dateOfBirth.push("dateOfBirth can not be blank");
    }

    //gender
    errorsData.gender = [];

    //gender cannot be blank
    if (!state.gender) {
      errorsData.gender.push("gender can not be blank");
    }

    //country
    errorsData.country = [];

    //country cannot be blank
    if (!state.country) {
      errorsData.country.push("country can not be blank");
    }
    errorsData.reciveNewsLetters = [];
    setErrors(errorsData);
  };

  let onRegisterClick = async () => {
    //set all properties as dirty
    let dirtyData = dirty;
    Object.keys(dirty).forEach((control) => {
      dirtyData[control] = true;
    });
    setDirty(dirtyData);
    validate();

    if (isValid()) {
      let response = await fetch("/users", {
        method: "POST",
        body: JSON.stringify({ ...state, role: "user" }),
        headers: {
          "Content-type": "application/json",
        },
      });
      if (response.ok) {
        let resBody = await response.json();
        userContextData.dispatch({
          type: "login",
          payload: {
            currentUserId: resBody.user.id,
            currentUserName: resBody.user.fullName,
            currentUserRole: resBody.user.role,
          },
        });
        setMessage(
          <span className="text-success">Successfully Registered</span>
        );
        navigate("/dashboard");
      } else {
        setMessage(
          <span className="text-danger">Errors in database connection</span>
        );
      }
      // let result = response.json()
      // console.log(response);
    } else {
      setMessage(<span className="text-danger">Errors</span>);
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
  useEffect(() => {
    validate();
  }, [state]);

  //executes only once - on initial render == componentDidMount method
  useEffect(() => {
    //ex:- load data from database
    document.title = "Register-eCommerce";
    myEmailRef.current.focus();
  }, []);

  useEffect(() => {
    // console.log(state.email);
  }, [state.email]);

  return (
    <>
      <div className="row">
        <div className="col-lg-6 col-md-7 mx-auto">
          <div className="card border-primary shadow my-2">
            <div className="card-header border-bottom border-primary">
              <h4
                style={{ fontSize: "40px" }}
                className="text-primary text-center"
              >
                Register
              </h4>

              <ul className="text-danger">
                {Object.keys(errors).map((control) => {
                  if (dirty[control]) {
                    return errors[control].map((err) => {
                      return <li key={err}>{err}</li>;
                    });
                  } else {
                    return "";
                  }
                })}
              </ul>
            </div>

            <div className="card-body border-bottom">
              {/* email starts */}
              <div className="form-group row">
                <label className="col-lg-4" htmlFor="email">
                  Email
                </label>
                <div className="col-lg-8">
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="form-control"
                    value={state.email}
                    onChange={(e) =>
                      setState({ ...state, [e.target.name]: e.target.value })
                    }
                    onBlur={(event) => {
                      setDirty({ ...dirty, [event.target.name]: true });
                      validate();
                    }}
                    ref={myEmailRef}
                  />
                  <div className="text-danger">
                    {dirty["email"] && errors["email"][0]
                      ? errors["email"]
                      : ""}
                  </div>
                </div>
              </div>
              {/* email ends */}

              {/* password starts */}
              <div className="form-group row">
                <label className="col-lg-4" htmlFor="password">
                  Password
                </label>
                <div className="col-lg-8">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="form-control"
                    value={state.password}
                    onChange={(e) =>
                      setState({ ...state, [e.target.name]: e.target.value })
                    }
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
              </div>
              {/* password ends */}

              {/* FullName starts */}
              <div className="form-group row">
                <label className="col-lg-4" htmlFor="fullName">
                  FullName
                </label>
                <div className="col-lg-8">
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    className="form-control"
                    value={state.fullName}
                    onChange={(e) =>
                      setState({ ...state, [e.target.name]: e.target.value })
                    }
                    onBlur={(event) => {
                      setDirty({ ...dirty, [event.target.name]: true });
                      validate();
                    }}
                  />
                  <div className="text-danger">
                    {dirty["fullName"] && errors["fullName"][0]
                      ? errors["fullName"]
                      : ""}
                  </div>
                </div>
              </div>
              {/* fullName ends */}

              {/* dateOfBirth starts */}
              <div className="form-group row">
                <label className="col-lg-4" htmlFor="dateOfBirth">
                  Date Of Birth
                </label>
                <div className="col-lg-8">
                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    className="form-control"
                    value={state.dateOfBirth}
                    onChange={(e) =>
                      setState({ ...state, [e.target.name]: e.target.value })
                    }
                    onBlur={(event) => {
                      setDirty({ ...dirty, [event.target.name]: true });
                      validate();
                    }}
                  />
                  <div className="text-danger">
                    {dirty["dateOfBirth"] && errors["dateOfBirth"][0]
                      ? errors["dateOfBirth"]
                      : ""}
                  </div>
                </div>
              </div>
              {/* dateOfBirth ends */}

              {/* gender starts */}
              <div className="form-group row">
                <label className="col-lg-4">Gender</label>
                <div className="col-lg-8">
                  <div className="form-check">
                    <input
                      type="radio"
                      name="gender"
                      id="male"
                      value="male"
                      checked={state.gender === "male" ? true : false}
                      className="form-check-input"
                      onChange={(e) =>
                        setState({
                          ...state,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />

                    <label className="form-check-inline" htmlFor="male">
                      Male
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      type="radio"
                      name="gender"
                      id="female"
                      value="female"
                      checked={state.gender === "female" ? true : false}
                      className="form-check-input"
                      onChange={(e) =>
                        setState({
                          ...state,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    <label className="form-check-inline" htmlFor="female">
                      Female
                    </label>
                  </div>
                  <div className="text-danger">
                    {dirty["gender"] && errors["gender"][0]
                      ? errors["gender"]
                      : ""}
                  </div>
                </div>
              </div>
              {/* gender ends */}

              {/* country starts */}
              <div className="form-group row">
                <label className="col-lg-4" htmlFor="country">
                  Country
                </label>
                <div className="col-lg-8">
                  <select
                    className="form-control"
                    name="country"
                    id="country"
                    value={state.country}
                    onChange={(e) =>
                      setState({ ...state, [e.target.name]: e.target.value })
                    }
                    onBlur={(event) => {
                      setDirty({ ...dirty, [event.target.name]: true });
                      validate();
                    }}
                  >
                    <option value="">Please Select</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.countryName}
                      </option>
                    ))}
                  </select>
                  <div className="text-danger">
                    {dirty["country"] && errors["country"][0]
                      ? errors["country"]
                      : ""}
                  </div>
                </div>
              </div>
              {/* country ends */}

              {/* reciveNewsLetters starts */}
              <div className="form-group row">
                <label className="col-lg-4"></label>
                <div className="col-lg-8">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="reciveNewsLetters"
                      id="reciveNewsLetters"
                      value="true"
                      checked={state.reciveNewsLetters === true ? true : false}
                      className="form-check-input"
                      onChange={(e) =>
                        setState({
                          ...state,
                          [e.target.name]: e.target.checked,
                        })
                      }
                      onBlur={(event) => {
                        setDirty({ ...dirty, [event.target.name]: true });
                        validate();
                      }}
                    />
                    <label
                      className="form-check-inline"
                      htmlFor="reciveNewsLetters"
                    >
                      Recive News Letters
                    </label>
                  </div>
                </div>
              </div>
              {/* reciveNewsLetters ends */}
            </div>
            {/* footer starts */}
            <div className="card-footer text-center">
              <div className="m-1">{message}</div>
              <div>
                <button
                  className="btn btn-primary m-2"
                  onClick={onRegisterClick}
                >
                  Register
                </button>
              </div>
            </div>
            {/* footer ends */}
          </div>
        </div>
      </div>
    </>
  );
}
