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

const Saved = (props) => {
  const [location, setLocation] = React.useState();
  const [center, setCenter] = React.useState();
  const [locationChecked, setLocationChecked] = React.useState(
    location ? true : false
  );
  const [numberPlaces, setNumberPlaces] = React.useState(0);
  const [markersChecked, setMarkersChecked] = React.useState(true);
  const [placesChecked, setPlacesChecked] = React.useState(true);
  const [places, setPlaces] = React.useState([]);
  const [savedLoading, setSavedLoading] = React.useState(1);
  const [savedQueryData, setSavedQueryData] = React.useState([]);
  const [savedQueryLimit, setSavedQueryLimit] = React.useState(10);

  const getCenterCoordinates = () => {
    if (savedQueryData.length) {
      let locationsArray = savedQueryData.map((el) => {
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
  }, [savedQueryData]);
  React.useEffect(() => {
    fetchSaved();
  }, [savedQueryLimit]);
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
  React.useEffect(() => {
    if (!savedQueryData || !location) {
      return false;
    }
    let myQueryData = [];
    savedQueryData.forEach((el) => {
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
  }, [location, savedQueryData]);
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
  const fetchSaved = async () => {
    await setSavedLoading(2);
    await axios
      .get("https://unpopular-backend.herokuapp.com/userSavedPlaces", {
        headers: { jwt: localStorage.getItem("jwt") },
        params: { limit: savedQueryLimit },
      })
      .then((data) => {
        setSavedQueryData(data.data);
        setSavedLoading(3);
      })
      .catch((err) => {
        setSavedLoading(1);
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
  React.useLayoutEffect(() => {
    fetchSaved();
    fetchNumberSaved();
  }, []);
  const fetchNumberSaved = () => {
    axios
      .get("https://unpopular-backend.herokuapp.com/user/count/savedPlaces", {
        headers: { jwt: localStorage.getItem("jwt") },
      })
      .then((data) => {
        setNumberPlaces(Number(data.data));
      })
      .catch((err) => {
        props.toast.error("Имаше проблем със сървъра при запитването.", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };
  return (
    <Box>
      <center>
        <Typography
          style={{ margin: "2vmax" }}
          className="likedText"
          variant="h3"
        >
          Запазени места
        </Typography>
        <Box className="oneLiner">
          <Typography gutterBottom variant="h5">
            {savedLoading == 3 && numberPlaces !== 0
              ? Number(numberPlaces) == 1
                ? "1 резултат"
                : Number(numberPlaces) == 2
                ? "2 резултата"
                : Number(numberPlaces) + " резултати"
              : savedLoading !== 2 && "Няма резултати"}
          </Typography>
          {savedLoading !== 2 && (
            <IconButton onClick={() => fetchSaved()}>
              <CachedIcon />
            </IconButton>
          )}
        </Box>
      </center>
      <Box maxWidth="sm">
        {!savedQueryData.length && savedLoading == 3 ? (
          <img
            src={require("../images/saved.svg").default}
            className="noResultsBanner"
          />
        ) : (
          ""
        )}

        {savedQueryData.length ? (
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
                    savedQueryData.map((el) => (
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
                              username={el[1][0].username}
                              inSearch={true}
                              inMap={true}
                              toast={props.toast}
                              key={Math.random()}
                              date={el[1][0].date}
                              user_id={el[1][0].user_id}
                              idData={el[1][0].place_id}
                              title={el[1][0].title}
                              views={el[1][0].views}
                              description={el[1][0].description}
                              price={el[1][0].price}
                              accessibility={el[1][0].accessibility}
                              category={el[1][0].category}
                              views={el[1][0].views}
                              placelocation={el[1][0].placelocation}
                              dangerous={el[1][0].dangerous}
                              user_id={el[1][0].user_id}
                              avatar={el[1][0].avatar}
                              likeButtonVisible={verify()}
                              reportButtonVisible={true}
                              liked={el[1][0].liked == "true" ? true : false}
                              saved={el[1][0].saved == "true" ? true : false}
                              numbersLiked={Number(el[1][0].likednumber)}
                              mainImg={el[1][0].url}
                              city={el[1][0].city}
                              images={el[1]}
                              saveButtonVisible={verify()}
                              adminRights={el[1][0].user_id == ID()}
                              distance={el[0]}
                              date={el[1][0].date}
                            />
                          </Overlay>
                        ))
                      : savedQueryData.map((el) => {
                          return (
                            <Overlay
                              offset={[0, 50]}
                              anchor={el[0].placelocation
                                .replace(/\s+/g, "")
                                .split(",")
                                .map(Number)}
                            >
                              <Card
                                inSearch={true}
                                username={el[0].username}
                                inMap={true}
                                date={el[0].date}
                                toast={props.toast}
                                key={Math.random()}
                                idData={el[0].place_id}
                                user_id={el[0].user_id}
                                title={el[0].title}
                                views={el[0].views}
                                views={el[0].views}
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
                                user_id={el[0].user_id}
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
                  <Typography>Сграда</Typography>
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
                  <Typography>Гледка</Typography>
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
                  <Typography>Екотуризъм</Typography>
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
                  <Typography>Изкуство</Typography>
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
                  <Typography>Заведение</Typography>
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
            {savedLoading == 3 || savedLoading == 1
              ? places.length && locationChecked
                ? places.map((el) => {
                    return (
                      <>
                        <Card
                          inSearch={true}
                          toast={props.toast}
                          key={Math.random()}
                          username={el[1][0].username}
                          date={el[1][0].date}
                          idData={el[1][0].place_id}
                          title={el[1][0].title}
                          description={el[1][0].description}
                          user_id={el[1][0].user_id}
                          views={el[1][0].views}
                          price={el[1][0].price}
                          accessibility={el[1][0].accessibility}
                          category={el[1][0].category}
                          placelocation={el[1][0].placelocation}
                          dangerous={el[1][0].dangerous}
                          user_id={el[1][0].user_id}
                          avatar={el[1][0].avatar}
                          likeButtonVisible={verify()}
                          reportButtonVisible={true}
                          liked={el[1][0].liked == "true" ? true : false}
                          saved={el[1][0].saved == "true" ? true : false}
                          numbersLiked={Number(el[1][0].likednumber)}
                          mainImg={el[1][0].url}
                          city={el[1][0].city}
                          images={el[1]}
                          saveButtonVisible={verify()}
                          adminRights={el[1][0].user_id == ID()}
                          distance={el[0]}
                          date={el[1][0].date}
                        />
                      </>
                    );
                  })
                : savedQueryData.map((el) => {
                    return (
                      <>
                        <Card
                          inSearch={true}
                          date={el[0].date}
                          toast={props.toast}
                          key={Math.random()}
                          idData={el[0].place_id}
                          username={el[0].username}
                          title={el[0].title}
                          description={el[0].description}
                          price={el[0].price}
                          user_id={el[0].user_id}
                          views={el[0].views}
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
                          user_id={el[0].user_id}
                          avatar={el[0].avatar}
                          images={el}
                          saveButtonVisible={verify()}
                          adminRights={el[0].user_id == ID()}
                        />
                      </>
                    );
                  })
              : !(window.innerWidth < window.innerHeight) && (
                  <ContentLoader
                    width={800}
                    height={575}
                    viewBox="0 0 800 575"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                    {...props}
                  >
                    <rect
                      x="12"
                      y="58"
                      rx="2"
                      ry="2"
                      width="211"
                      height="211"
                    />
                    <rect
                      x="240"
                      y="57"
                      rx="2"
                      ry="2"
                      width="211"
                      height="211"
                    />
                    <rect
                      x="467"
                      y="56"
                      rx="2"
                      ry="2"
                      width="211"
                      height="211"
                    />
                    <rect
                      x="12"
                      y="283"
                      rx="2"
                      ry="2"
                      width="211"
                      height="211"
                    />
                    <rect
                      x="240"
                      y="281"
                      rx="2"
                      ry="2"
                      width="211"
                      height="211"
                    />
                    <rect
                      x="468"
                      y="279"
                      rx="2"
                      ry="2"
                      width="211"
                      height="211"
                    />
                  </ContentLoader>
                )}
          </FadeIn>
        ) : (
          ""
        )}
        {(savedLoading == 3 || savedLoading == 1) &&
        Number(savedQueryLimit) < Number(numberPlaces) ? (
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
                setSavedQueryLimit((prev) => prev + 10);
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

export default Saved;
