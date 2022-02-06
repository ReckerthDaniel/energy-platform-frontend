import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardDevice from "./components/BoardDevice";
import BoardMeasurement from "./components/BoardMeasurement";
import BoardClientDevice from "./components/BoardClientDevice";
import HistoricalEC from "./components/HistoricalEC";
import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from "./helpers/history";

import AuthVerify from "./common/AuthVerify";
import EventBus from "./common/EventBus";
import BoardClientHistory from "./components/BoardClientHistory";

import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import authHeader from "./services/auth-header";

const API_URL = "https://ds2021-energy-daniel-backend.herokuapp.com/";
//const API_URL = "http://localhost:8080/api/";

const App = () => {
  const [showDeviceBoard, setShowDeviceBoard] = useState(false);
  const [showUserBoard, setShowUserBoard] = useState(false);
  const [showMeasurementBoard, setShowMeasurementBoard] = useState(false);
  const [showClientDeviceBoard, setShowClientDeviceBoard] = useState(false);
  const [showClientHistory, setShowClientHistory] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setShowDeviceBoard(currentUser.role.includes("ADMIN"));
      setShowUserBoard(currentUser.role.includes("ADMIN"));
      setShowMeasurementBoard(currentUser.role.includes("ADMIN"));
      setShowClientDeviceBoard(currentUser.role.includes("CLIENT"));
      setShowClientHistory(currentUser.role.includes("CLIENT"));

      var sock = new SockJS(API_URL + 'ws-message');
      let stompClient = Stomp.over(sock);

      stompClient.connect({headers: authHeader()}, function(frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe("/topic/" + currentUser.username, function(error) {
          alert(error.body);
        });
      });

    } else {
      setShowDeviceBoard(false);
      setShowUserBoard(false);
      setShowMeasurementBoard(false);
      setShowClientDeviceBoard(false);
      setShowClientHistory(false);
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser, logOut]);

  return (
    <Router history={history}>
      <div className="main-body">
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Energy Platform
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>

            {showDeviceBoard && (
              <li className="nav-item">
                <Link to={"/device"} className="nav-link">
                  Devices
                </Link>
              </li>
            )}

            {showUserBoard && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  Users
                </Link>
              </li>
            )}

            {showMeasurementBoard && (
              <li className="nav-item">
                <Link to={"/measurement"} className="nav-link">
                  Measurements
                </Link>
              </li>
            )}

            {showClientDeviceBoard && (
              <li className="nav-item">
                <Link to={`/devices/${currentUser.id}`} className="nav-link">
                  My Devices
                </Link>
              </li>
            )}

            {showClientHistory && (!showMeasurementBoard) && (
              <li className="nav-item">
                <Link to={`/history/${currentUser.id}`} className="nav-link" >
                  History
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/user" component={BoardUser} />
            <Route path="/device" component={BoardDevice}/>
            <Route path="/measurement" component={BoardMeasurement}/>
            <Route path="/devices/:id" component={BoardClientDevice}/>
            <Route path="/device/measurements/:id" component={BoardClientDevice}/>
            <Route path="/history/:id" component={BoardClientHistory}/>
            <Route path="/historical-ec/:id" component={HistoricalEC}/>
          </Switch>
        </div>

        <AuthVerify logOut={logOut}/>
      </div>
    </Router>
  );
};

export default App;