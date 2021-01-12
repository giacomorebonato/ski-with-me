import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Search from "./components/Search";
import SkiersList from "./components/SkiersList";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import axios from "axios";
import { Navbar } from "react-bootstrap";
// import { identity } from "lodash";

function App() {
  const [isUserLoggedin, setUserLoggedIn] = useState(false);
  const [name, getName] = useState("");
  const [skierList, setSkierList] = useState([])
  const [intialSkierList, setintialSkierList] = useState([])
  const [sport, setSport] = useState("")
  const [level, setLevel] = useState("")
  const [resort, setResort] = useState("")
  const [language, setLanguage] = useState("")
  const [userId, getUserId] = useState()

  const getUserdatafromDB = async () => {
    try {
      const resp = await axios.get('/users/profile', {
        headers: {
          "x-access-token": localStorage.getItem("skiBuddyToken")
        }
      }
      );
      // console.log("data from DB", resp.data)
      getUserId(resp.data.id)
      getName(resp.data.name);
      setUserLoggedIn(true);
    } catch (err) {
      // Handle Error Here
      console.error("User is not loged in");
    }
  }


  const getInitialSkierList = async () => {
    try {
      const resp = await axios.get(`/everything`);
      // setintialSkierList(resp.data)
      setintialSkierList(resp.data.filter((skier, index) => skier.id !== userId))

    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  };

  const getSkierListfromDB = async () => {

    try {
      // const resp = await axios.get('/everything');
      const resp = await axios.get(`/everything?language=${language}&sport=${sport}&level=${level}&resort=${resort}`);
      setSkierList(resp.data.filter((skier, index) => skier.id !== userId))

    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  };

  useEffect(() => {
    getUserdatafromDB()
    getSkierListfromDB()
    getInitialSkierList()
  }, [sport, level, language, resort, userId]);


  const getSportSearched = (sportSearched) => {
    setSport(sportSearched)
  }

  const getLevelSearched = (levelSearched) => {
    setLevel(levelSearched)
  }

  const getResortSearched = (resortSearched) => {
    setResort(resortSearched)
  }

  const getLanguageSearched = (languageSearched) => {
    setLanguage(languageSearched)
  }


  function handleLogout() {
    setUserLoggedIn(false);
    getName("")
    getUserId(null)
    window.localStorage.removeItem('skiBuddyToken');
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <Router>
            <Navbar bg="dark" variant="dark" className="mt-3 mb-3">
              <Navbar.Brand href="/">Ski Buddies</Navbar.Brand>
              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                {isUserLoggedin ? (
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Navbar.Text>
                        Welcome {name}
                      </Navbar.Text>
                    </li>
                    <li className="nav-item">
                      <Link to="/"
                        className="nav-link"
                        style={{ 'color': '#e2e2e5' }}
                        onClick={handleLogout}>Log out
                </Link>
                    </li>
                  </ul>


                ) : (
                    <ul className="navbar-nav">
                      <li className="nav-item">
                        <Link to="/login"
                          className="nav-link"
                          style={{ 'color': '#e2e2e5' }}>
                          Login
                  </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          to="/register"
                          className="nav-link"
                          style={{ 'color': '#e2e2e5' }}
                        // data-toggle="modal"
                        // data-target="#exampleModalLong"
                        >
                          Sign Up
                  </Link>
                      </li>
                    </ul>
                  )}
              </Navbar.Collapse>
            </Navbar>

            <Switch>
              <Route path="/login">
                {isUserLoggedin ? (
                  <Redirect to="/" />
                ) : (
                    <Login updateLoggedIn={setUserLoggedIn} getName={getName} getUserId={getUserId} />
                  )}
              </Route>
              <Route path="/register">
                {<Register
                  updateLoggedIn={setUserLoggedIn}
                  getName={getName}
                  getUserId={getUserId}
                  intialSkierList={intialSkierList} />}
              </Route>
              <Route path="/">
                <div className="row">
                  <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-12">
                    <Search getSportSearched={getSportSearched}
                      getLevelSearched={getLevelSearched}
                      getResortSearched={getResortSearched}
                      getLanguageSearched={getLanguageSearched}
                      skierListData={skierList}
                      intialSkierList={intialSkierList}
                    />
                  </div>
                  <div className="col-sm-12 col-md-9 col-lg-9 col-xl-9 mb-12">
                    <div className="row">
                      <SkiersList isUserLoggedin={isUserLoggedin} skierListData={skierList} />
                    </div>
                  </div>
                </div>
              </Route>
            </Switch>
            {/* <div className="row">
              <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-12">
                <Search getSportSearched={getSportSearched}
                  getLevelSearched={getLevelSearched}
                  getResortSearched={getResortSearched}
                  getLanguageSearched={getLanguageSearched}
                  skierListData={skierList}
                  intialSkierList={intialSkierList}
                />
              </div>
              <div className="col-sm-12 col-md-9 col-lg-9 col-xl-9 mb-12">
                <div className="row">
                  <SkiersList isUserLoggedin={isUserLoggedin} skierListData={skierList} />
                </div>
              </div>
            </div> */}
          </Router>
        </div>
      </div>

    </div>
  );
}

export default App;
