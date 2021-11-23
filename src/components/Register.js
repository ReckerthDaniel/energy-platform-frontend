import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

import { register } from "../actions/auth";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const vfullname = (value) => {
  if(value.length < 3 || value.length > 35) {
    return (
      <div className="alert alert-danger" role="aler">
        The name must be between 3 and 35 characters.
      </div>
    );
  }
};

const vusername = (value) => {
  if(value.length < 3 || value.length > 15) {
    return (
      <div className="alert alert-danger" role="aler">
        The username must be between 3 and 15 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if(value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="aler">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const vaddress = (value) => {
  if(value.length < 3 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="aler">
        The address must be between 3 and 40 characters.
      </div>
    );
  }
};

const Register = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState(new Date());
  const [address, setAddress] = useState("");
  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector(state => state.message);
  const dispatch = useDispatch();

  const onChangeFullname = (e) => {
    const fullname = e.target.value;
    setFullName(fullname);
  }

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  }

  
  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  }

  const onChangeBirthday = (e) => {
    const birthday = e.target.value;
    setBirthday(birthday);
  }

  const onChangeAddress = (e) => {
    const address = e.target.value;
    setAddress(address);
  }

  const handleRegister = (e) => {
    e.preventDefault();

    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      dispatch(register(fullName, username, password, birthday, address))
        .then(() => {
          setSuccessful(true);
        })
        .catch(() => {
          setSuccessful(false);
        });
    }
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Form onSubmit={handleRegister} ref={form}>
          {!successful && (
            <div>
              <div className="form-group">
                <label htmlFor="fullname">Full name</label>
                <Input
                  type="text"
                  className="form-control"
                  name="fullname"
                  value={fullName}
                  onChange={onChangeFullname}
                  validations={[required, vfullname]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <Input
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  onChange={onChangeUsername}
                  validations={[required, vusername]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Input
                  type="text"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required, vpassword]}
                />
              </div>


              <div className="form-group">
                <label htmlFor="birthday">Birthday</label>
                <DatePicker
                  selected={birthday}
                  onChange={(date) => setBirthday(date)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <Input
                  type="text"
                  className="form-control"
                  name="address"
                  value={address}
                  onChange={onChangeAddress}
                  validations={[required, vaddress]}
                />
              </div>

              <div className="form-group">
                <button className="btn btn-primary btn-block mx-auto d-block">Sign Up</button>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group">
              <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default Register;

