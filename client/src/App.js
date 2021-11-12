import React from "react";
import AppBar from "./components/appBar";
import Search from "./components/search";
import Box from "@material-ui/core/Box";
import Profile from "./components/profile";
import Login from "./components/login";
import Register from "./components/register";
import Upload from "./components/upload";
import Liked from "./components/liked";
import Saved from "./components/saved";
import Place from "./components/place";
import jwt_decode from "jwt-decode";
import Verify from "./components/verifyEmail";
import ResetPassword from "./components/resetPassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Switch, Route, Redirect } from "react-router-dom";
function App() {
  //Search component
  const [center, setCenter] = React.useState();
  const [zoom, setZoom] = React.useState();
  const [view, setView] = React.useState(1);
  const [searchQueryLength, setSearchQueryLength] = React.useState(0);
  const [queryData, setQueryData] = React.useState([]);
  const [searchQueryLimit, setSearchQueryLimit] = React.useState(10);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [prevSearchQuery, setPrevSearchQuery] = React.useState("");
  const [searchCity, setSearchCity] = React.useState("");
  const [searchCategory, setSearchCategory] = React.useState(1);
  const [searchPrice, setSearchPrice] = React.useState(1);
  const [searchDangerous, setSearchDangerous] = React.useState(1);
  const [searchAccessibility, setSearchAccessibility] = React.useState(1);
  const [searchShowFilters, searchSetShowFilters] = React.useState(false);
  const [searchLoading, setSearchLoading] = React.useState(1);
  //Liked component
  const [likedQueryData, setLikedQueryData] = React.useState([]);
  const [likedLoading, setLikedLoading] = React.useState(1);
  const [likedQueryLimit, setLikedQueryLimit] = React.useState(10);
  //Saved component
  const [savedQueryData, setSavedQueryData] = React.useState([]);
  const [savedLoading, setSavedLoading] = React.useState(1);
  const [savedQueryLimit, setSavedQueryLimit] = React.useState(10);

  const ls = () => {
    if (localStorage.getItem("jwt")) {
      return true;
    } else {
      return false;
    }
  };
  const lsA = () => {
    try {
      if (jwt_decode(localStorage.getItem("jwt")).Authorized) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  return (
    <div styles={{ backgroundColor: "#232526" }} className="App">
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <AppBar lsA={lsA} setView={setView} />
      <Box className="spaceFiller"></Box>
      <Switch>
        <Route exact path="/search">
          <Search
            center={center}
            setCenter={setCenter}
            zoom={zoom}
            setZoom={setZoom}
            searchQueryLimit={searchQueryLimit}
            setSearchQueryLimit={setSearchQueryLimit}
            searchQueryDataLength={searchQueryLength}
            setSearchQueryDataLength={setSearchQueryLength}
            toast={toast}
            prevSearchQuery={prevSearchQuery}
            setPrevSearchQuery={setPrevSearchQuery}
            searchLoading={searchLoading}
            setSearchLoading={setSearchLoading}
            queryData={queryData}
            setQueryData={setQueryData}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchShowFilters={searchShowFilters}
            searchSetShowFilters={searchSetShowFilters}
            searchCity={searchCity}
            setSearchCity={setSearchCity}
            searchCategory={searchCategory}
            setSearchCategory={setSearchCategory}
            searchPrice={searchPrice}
            setSearchPrice={setSearchPrice}
            searchDangerous={searchDangerous}
            setSearchDangerous={setSearchDangerous}
            searchAccessibility={searchAccessibility}
            setSearchAccessibility={setSearchAccessibility}
          />
        </Route>
        <Route
          path="/favorite"
          component={() =>
            lsA() ? (
              <Liked
                toast={toast}
                likedQueryData={likedQueryData}
                setLikedQueryData={setLikedQueryData}
                likedLoading={likedLoading}
                setLikedLoading={setLikedLoading}
                likedQueryLimit={likedQueryLimit}
                setLikedQueryLimit={setLikedQueryLimit}
                setLikedQueryData={setLikedQueryData}
              />
            ) : (
              <Redirect from="/favorite" to="/search" />
            )
          }
          exact
        />

        <Route
          exact
          path="/saved"
          component={() =>
            ls() && lsA() ? (
              <Saved
                toast={toast}
                savedQueryData={savedQueryData}
                setSavedQueryData={setSavedQueryData}
                savedLoading={savedLoading}
                setSavedLoading={setSavedLoading}
                savedQueryLimit={savedQueryLimit}
                setSavedQueryLimit={setSavedQueryLimit}
              />
            ) : (
              <Redirect from="/saved" to="/search" />
            )
          }
        />
        <Route exact path="/login" component={() => <Login lsA={lsA} />} />
        <Route
          exact
          path="/register"
          component={() => <Register lsA={lsA} />}
        />
        <Route
          exact
          path="/upload"
          component={() =>
            ls() && lsA() ? (
              <Upload />
            ) : (
              <Redirect from="/upload" to="/search" />
            )
          }
        />
        <Route
          exact
          path="/verify"
          component={() => ls() && <Verify toast={toast} lsA={lsA} />}
        />
        <Route
          exact
          path="/profile"
          component={() =>
            lsA() && ls() ? (
              <Profile toast={toast} />
            ) : (
              <Redirect from="/profile" to="/search" />
            )
          }
        />
        <Route path="/place/:id" component={() => <Place toast={toast} />} />
        <Route
          path="/reset/:id"
          component={() => <ResetPassword toast={toast} />}
        />

        <Redirect from="/" to="/search" />
      </Switch>
      <Box className="spaceFiller"></Box>
    </div>
  );
}

export default App;
