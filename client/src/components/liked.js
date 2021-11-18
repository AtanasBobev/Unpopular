import React from "react";
import FadeIn from "react-fade-in";
import Card from "./card";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ContentLoader from "react-content-loader";
import CachedIcon from "@material-ui/icons/Cached";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import Checkbox from "@material-ui/core/Checkbox";
import { getCenter, getPreciseDistance } from "geolib";

import jwt_decode from "jwt-decode";
import { Map, Marker, ZoomControl, Overlay } from "pigeon-maps";
const axios = require("axios");
const Liked = (props) => {
  const [location, setLocation] = React.useState();
  const [center, setCenter] = React.useState();
  const [locationChecked, setLocationChecked] = React.useState(
    location ? true : false
  );

  const [markersChecked, setMarkersChecked] = React.useState(true);
  const [placesChecked, setPlacesChecked] = React.useState(true);
  const [places, setPlaces] = React.useState([]);
  const [likedLoading, setLikedLoading] = React.useState(1);
  const [likedQueryData, setLikedQueryData] = React.useState([]);
  const [likedQueryLimit, setLikedQueryLimit] = React.useState(10);
  const getCenterCoordinates = () => {
    if (likedQueryData.length) {
      let locationsArray = likedQueryData.map((el) => {
        return {
          latitude: el[0].placelocation
            .replace(/\s+/g, "")
            .split(",")
            .map(Number)[0],
          longitude: el[0].placelocation
            .replace(/\s+/g, "")
            .split(",")
            .map(Number)[1],
        };
      });
      setCenter([
        getCenter(locationsArray).latitude,
        getCenter(locationsArray).longitude,
      ]);
    } else {
      return false;
    }
  };
  React.useEffect(() => {
    getCenterCoordinates();
  }, [likedQueryData]);
  const markerColor = (e) => {
    switch (Number(e.category)) {
      case 1:
        return "purple";

      case 2:
        return "orange";

      case 3:
        return "RoyalBlue";

      case 4:
        return "green";

      case 5:
        return "pink";

      case 6:
        return "purple";

      default:
        return "black";
    }
  };
  const ID = () => {
    try {
      let a = jwt_decode(localStorage.getItem("jwt"));
      return a.user_id;
    } catch (err) {
      return false;
    }
  };
  const verify = () => {
    try {
      let a = jwt_decode(localStorage.getItem("jwt"));
      return a.Authorized ? true : false;
    } catch (err) {
      return false;
    }
  };
  const fetchLiked = () => {
    setLikedLoading(2);
    axios
      .get("http://localhost:5000/userLikedPlaces", {
        headers: { jwt: localStorage.getItem("jwt") },
        params: { limit: likedQueryLimit },
      })
      .then((data) => {
        setLikedQueryData(data.data);
        setLikedLoading(3);
      })
      .catch((err) => {
        setLikedLoading(1);
        props.toast.error(
          "Имаше проблем със сървъра при запитването. Пробвайте отново по-късно!",
          {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      });
  };
  React.useEffect(() => {
    fetchLiked();
  }, []);
  React.useEffect(() => {
    if (!likedQueryData || !location) {
      return false;
    }
    console.log(likedQueryData);
    let myQueryData = [];
    likedQueryData.forEach((el) => {
      let distance = getPreciseDistance(
        { latitude: location[0], longitude: location[1] },
        {
          latitude: el[0].placelocation
            .replace(/\s+/g, "")
            .split(",")
            .map(Number)[0],
          longitude: el[0].placelocation
            .replace(/\s+/g, "")
            .split(",")
            .map(Number)[1],
        }
      );
      myQueryData.push([distance, el]);
      setPlaces(myQueryData.sort((a, b) => a[0] - b[0]));
    });
  }, [location, likedQueryData]);
  React.useEffect(() => {
    if (!locationChecked) {
      return false;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (e) => {
          setLocation([e.coords.latitude, e.coords.longitude]);
        },
        (e) => {
          props.toast.warn("Трябва да ни дадете достъп до Вашата геолокация", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      );
    } else {
      props.toast.warn("Браузърът Ви не поддържа геолокация", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [locationChecked]);
  return (
    <Box>
      <center>
        <Typography style={{ margin: "2vmax" }} variant="h3">
          Харесани места
        </Typography>
        <Box className="oneLiner">
          <Typography gutterBottom variant="h5">
            {Number(likedQueryData.length) == 0
              ? "Няма резултати"
              : Number(likedQueryData.length) + " резултати"}
          </Typography>
          {likedLoading !== 2 && (
            <IconButton onClick={() => fetchLiked()}>
              <CachedIcon />
            </IconButton>
          )}
        </Box>
      </center>
      {likedQueryData.length == 0 && likedLoading == 3 ? (
        <img
          src={require("../images/liked.svg").default}
          className="noResultsBanner"
        />
      ) : (
        ""
      )}
      <Box maxWidth="sm">
        {likedQueryData.length ? (
          <FadeIn
            transitionDuration={600}
            delay={100}
            className="CardContainer"
          >
            <div className="MapContainer">
              <center>
                <Map
                  metaWheelZoom={true}
                  metaWheelZoomWarning={
                    "Използвайте ctrl+scroll, за да промените мащаба"
                  }
                  center={location ? location : center}
                  zoom={7}
                  width={"70vw"}
                  height={"60vh"}
                >
                  <ZoomControl />
                  {locationChecked && location && (
                    <Marker anchor={location} color={"red"} />
                  )}
                  {markersChecked &&
                    location &&
                    likedQueryData.map((el) => (
                      <Marker
                        anchor={el[0].placelocation
                          .replace(/\s+/g, "")
                          .split(",")
                          .map(Number)}
                        color={markerColor(el[0])}
                      />
                    ))}
                  {placesChecked &&
                    (places.length && locationChecked
                      ? places.map((el) => (
                          <Overlay
                            offset={[0, 50]}
                            anchor={el[1][0].placelocation
                              .replace(/\s+/g, "")
                              .split(",")
                              .map(Number)}
                          >
                            <Card
                              inMap={true}
                              toast={props.toast}
                              key={Math.random()}
                              date={el[1][0].date}
                              idData={el[1][0].place_id}
                              title={el[1][0].title}
                              description={el[1][0].description}
                              price={el[1][0].price}
                              accessibility={el[1][0].accessibility}
                              category={el[1][0].category}
                              placelocation={el[1][0].placelocation}
                              dangerous={el[1][0].dangerous}
                              username={el[1][0].username}
                              avatar={el[1][0].avatar}
                              likeButtonVisible={verify()}
                              reportButtonVisible={true}
                              liked={el[1][0].liked == "true" ? true : false}
                              saved={el[1][0].saved == "true" ? true : false}
                              numbersLiked={Number(el[1][0].likednumber)}
                              mainImg={el[1][0].url}
                              city={el[1][0].city}
                              images={el}
                              saveButtonVisible={verify()}
                              adminRights={el[1][0].user_id == ID()}
                              distance={el[0]}
                              date={el[1][0].date}
                            />
                          </Overlay>
                        ))
                      : likedQueryData.map((el) => {
                          return (
                            <Overlay
                              offset={[0, 50]}
                              anchor={el[0].placelocation
                                .replace(/\s+/g, "")
                                .split(",")
                                .map(Number)}
                            >
                              <Card
                                inMap={true}
                                date={el[0].date}
                                toast={props.toast}
                                key={Math.random()}
                                idData={el[0].place_id}
                                title={el[0].title}
                                description={el[0].description}
                                price={el[0].price}
                                accessibility={el[0].accessibility}
                                category={el[0].category}
                                placelocation={el[0].placelocation}
                                dangerous={el[0].dangerous}
                                likeButtonVisible={verify()}
                                reportButtonVisible={true}
                                liked={el[0].liked == "true" ? true : false}
                                saved={el[0].saved == "true" ? true : false}
                                numbersLiked={Number(el[0].likednumber)}
                                mainImg={el[0].url}
                                city={el[0].city}
                                username={el[0].username}
                                avatar={el[0].avatar}
                                images={el}
                                saveButtonVisible={verify()}
                                adminRights={el[0].user_id == ID()}
                              />
                            </Overlay>
                          );
                        }))}
                </Map>
              </center>

              <Box
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "0.5vmax",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      height: "1vmax",
                      width: "1vmax",
                      borderRadius: "50%",
                      backgroundColor: "red",
                      marginRight: "0.5vmax",
                      marginLeft: "1vmax",
                    }}
                  ></div>
                  <Typography>Моята локация</Typography>

                  <div
                    style={{
                      height: "1vmax",
                      width: "1vmax",
                      borderRadius: "50%",
                      backgroundColor: "purple",
                      marginRight: "0.5vmax",
                      marginLeft: "1vmax",
                    }}
                  ></div>
                  <Typography>Заведение</Typography>
                  <div
                    style={{
                      height: "1vmax",
                      width: "1vmax",
                      borderRadius: "50%",
                      backgroundColor: "orange",
                      marginRight: "0.5vmax",
                      marginLeft: "1vmax",
                    }}
                  ></div>
                  <Typography>Нощно заведение</Typography>
                  <div
                    style={{
                      height: "1vmax",
                      width: "1vmax",
                      borderRadius: "50%",
                      backgroundColor: "RoyalBlue",
                      marginRight: "0.5vmax",
                      marginLeft: "1vmax",
                    }}
                  ></div>
                  <Typography>Магазин</Typography>
                  <div
                    style={{
                      height: "1vmax",
                      width: "1vmax",
                      borderRadius: "50%",
                      backgroundColor: "green",
                      marginRight: "0.5vmax",
                      marginLeft: "1vmax",
                    }}
                  ></div>
                  <Typography>Пътека</Typography>
                  <div
                    style={{
                      height: "1vmax",
                      width: "1vmax",
                      borderRadius: "50%",
                      backgroundColor: "pink",
                      marginRight: "0.5vmax",
                      marginLeft: "1vmax",
                    }}
                  ></div>
                  <Typography>Място</Typography>
                  <div
                    style={{
                      height: "1vmax",
                      width: "1vmax",
                      borderRadius: "50%",
                      backgroundColor: "black",
                      marginRight: "0.5vmax",
                      marginLeft: "1vmax",
                    }}
                  ></div>
                  <Typography>Друго</Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <Switch
                    checked={locationChecked && location}
                    onChange={(e) => setLocationChecked(e.target.checked)}
                  />
                  <Typography>Сортирай по близост</Typography>
                  <Checkbox
                    trackColor={{ true: "red", false: "grey" }}
                    checked={markersChecked}
                    onChange={(e) => setMarkersChecked(e.target.checked)}
                  />
                  <Typography>Маркери</Typography>
                  <Checkbox
                    checked={placesChecked}
                    onChange={(e) => setPlacesChecked(e.target.checked)}
                  />
                  <Typography>Места</Typography>
                </div>
              </Box>
            </div>
            {likedLoading == 3 || likedLoading == 1 ? (
              places.length && locationChecked ? (
                places.map((el) => {
                  return (
                    <>
                      <Card
                        toast={props.toast}
                        key={Math.random()}
                        date={el[1][0].date}
                        idData={el[1][0].place_id}
                        title={el[1][0].title}
                        description={el[1][0].description}
                        price={el[1][0].price}
                        accessibility={el[1][0].accessibility}
                        category={el[1][0].category}
                        placelocation={el[1][0].placelocation}
                        dangerous={el[1][0].dangerous}
                        username={el[1][0].username}
                        avatar={el[1][0].avatar}
                        likeButtonVisible={verify()}
                        reportButtonVisible={true}
                        liked={el[1][0].liked == "true" ? true : false}
                        saved={el[1][0].saved == "true" ? true : false}
                        numbersLiked={Number(el[1][0].likednumber)}
                        mainImg={el[1][0].url}
                        city={el[1][0].city}
                        images={el}
                        saveButtonVisible={verify()}
                        adminRights={el[1][0].user_id == ID()}
                        distance={el[0]}
                        date={el[1][0].date}
                      />
                    </>
                  );
                })
              ) : (
                likedQueryData.map((el) => {
                  return (
                    <>
                      <Card
                        date={el[0].date}
                        toast={props.toast}
                        key={Math.random()}
                        idData={el[0].place_id}
                        title={el[0].title}
                        description={el[0].description}
                        price={el[0].price}
                        accessibility={el[0].accessibility}
                        category={el[0].category}
                        placelocation={el[0].placelocation}
                        dangerous={el[0].dangerous}
                        likeButtonVisible={verify()}
                        reportButtonVisible={true}
                        liked={el[0].liked == "true" ? true : false}
                        saved={el[0].saved == "true" ? true : false}
                        numbersLiked={Number(el[0].likednumber)}
                        mainImg={el[0].url}
                        city={el[0].city}
                        username={el[0].username}
                        avatar={el[0].avatar}
                        images={el}
                        saveButtonVisible={verify()}
                        adminRights={el[0].user_id == ID()}
                      />
                    </>
                  );
                })
              )
            ) : (
              <ContentLoader
                width={800}
                height={575}
                viewBox="0 0 800 575"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                {...props}
              >
                <rect x="12" y="58" rx="2" ry="2" width="211" height="211" />
                <rect x="240" y="57" rx="2" ry="2" width="211" height="211" />
                <rect x="467" y="56" rx="2" ry="2" width="211" height="211" />
                <rect x="12" y="283" rx="2" ry="2" width="211" height="211" />
                <rect x="240" y="281" rx="2" ry="2" width="211" height="211" />
                <rect x="468" y="279" rx="2" ry="2" width="211" height="211" />
              </ContentLoader>
            )}
          </FadeIn>
        ) : (
          ""
        )}
        {likedLoading == 3 &&
        likedQueryData.length &&
        Number(likedQueryData[0][0]["count"]) !== 0 &&
        Number(likedQueryData[0][0]["count"]) > likedQueryLimit ? (
          <Box
            style={{
              width: "100vw",
              display: "flex",
              justifyContent: "center",
              marginTop: "2vmax",
            }}
          >
            <Button
              onClick={() => {
                setLikedQueryLimit((prev) => prev + 10);
              }}
              startIcon={<AddIcon />}
            >
              Зареди още
            </Button>
          </Box>
        ) : (
          ""
        )}
      </Box>
    </Box>
  );
};

export default Liked;
