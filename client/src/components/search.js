import React from "react";
import FormHelperText from "@material-ui/core/FormHelperText";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FilterListIcon from "@material-ui/icons/FilterList";
import Typography from "@material-ui/core/Typography";
import Card from "./card";
import ContentLoader from "react-content-loader";
import Tilty from "react-tilty";
import FadeIn from "react-fade-in";
import AddIcon from "@material-ui/icons/Add";
import { Map, Marker, ZoomControl, Overlay } from "pigeon-maps";
import jwt_decode from "jwt-decode";
import { getCenter, getPreciseDistance } from "geolib";
import Checkbox from "@material-ui/core/Checkbox";
import Switch from "@material-ui/core/Switch";
import Quotes from "./quotes";
import Poems from "./poems";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { ToastContainer } from "react-toastify";
const axios = require("axios");
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#4169e1",
    },
    secondary: {
      main: "#4169e1",
    },
  },
});
const Search = (props) => {
  const [location, setLocation] = React.useState();
  const [center, setCenter] = React.useState();
  const [locationChecked, setLocationChecked] = React.useState(
    location ? true : false
  );
  const [available, setAvailable] = React.useState([]);
  const [availablePoem, setAvailablePoem] = React.useState([]);
  const [markersChecked, setMarkersChecked] = React.useState(true);
  const [placesChecked, setPlacesChecked] = React.useState(true);
  const [places, setPlaces] = React.useState([]);
  const [change, setChange] = React.useState([]);
  const toSort = (arr = props.queryData) => {
    if (!props.queryData || !location) {
      return false;
    }
    let myQueryData = [];
    arr.forEach((el) => {
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
  };
  React.useEffect(() => {
    toSort();
  }, [location, props.queryData]);
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
  const RemoveDuplicates = (array, key) => {
    return array.reduce((arr, item) => {
      const removed = arr.filter((i) => i[0][key] !== item[0][key]);
      return [...removed, item];
    }, []);
  };
  const search = () => {
    setChange([]);
    props.setQueryData([]);
    props.setSearchLoading(2);
    setAvailable([]);
    //Get place count
    axios
      .request({
        url: "http://localhost:5000/searchCount",
        method: "POST",
        data: {
          location: props.searchCity,
          category: props.searchCategory,
          price: props.searchPrice,
          dangerous: props.searchDangerous,
          accessibility: props.searchAccessibility,
          query: props.searchQuery,
        },
      })
      .then((data) => {
        props.setSearchQueryDataLength(Number(data.data["count"]));
      })
      .catch((err) => {
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
    //Get place info
    axios
      .request({
        url: "http://localhost:5000/search",
        method: "POST",
        headers: {
          jwt: localStorage.getItem("jwt") ? localStorage.getItem("jwt") : "",
        },
        data: {
          sort: props.admin,
          location: props.searchCity,
          category: props.searchCategory,
          price: props.searchPrice,
          dangerous: props.searchDangerous,
          accessibility: props.searchAccessibility,
          query: props.searchQuery,
          limit: props.searchQueryLimit,
          offset: 0,
        },
      })
      .then((data) => {
        props.setSearchLoading(3);
        props.setPrevSearchQuery(props.searchQuery);
        if (!data.data.length) {
          props.setQueryData([]);
          //   props.setSearchQueryLimit(10);
          return false;
        }
        if (!props.queryData.length) {
          props.setQueryData(data.data.reverse());
        } else {
          let temp = data.data.concat(props.queryData);
          props.setQueryData(RemoveDuplicates(temp, "place_id"));
        }
      })
      .catch((err) => {
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
        props.setSearchLoading(1);
      });
  };

  React.useEffect(() => {
    search();
  }, [props.searchQueryLimit]);
  const verify = () => {
    try {
      let a = jwt_decode(localStorage.getItem("jwt"));
      return a.Authorized ? true : false;
    } catch (err) {
      return false;
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
  const getCenterCoordinates = () => {
    if (props.queryData.length) {
      let locationsArray = props.queryData.map((el) => {
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
  }, [props.queryData]);
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

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          maxWidth="80vw"
          marginLeft="10vw"
        >
          <Tilty axis="X" gyroscope={false} perspective={2000}>
            <TextField
              onBlur={(e) => props.setSearchQuery(e.target.value)}
              inputProps={{ style: { fontSize: 40, textAlign: "center" } }}
              margin="normal"
              helperText="Намери следващотото приключение"
              className="searchInput"
              defaultValue={props.searchQuery}
            />
          </Tilty>
          <Button
            className="SearchInComponentButton"
            startIcon={<SearchIcon />}
            style={{
              transform: "1s",
              textTransform: "none",
              marginLeft: "3vmax",
              marginRight: "1vmax",
            }}
            size="large"
            variant="outlined"
            onClick={async () => {
              if (props.searchQueryLimit !== 0) {
                props.setSearchQueryLimit(0);
              } else {
                search();
              }
            }}
          >
            Търсене
          </Button>
          <Button
            startIcon={<FilterListIcon />}
            onClick={() => {
              props.searchSetShowFilters((value) => !value);
            }}
          >
            Филтри
          </Button>
          <br></br>
        </Box>
        {props.searchShowFilters && (
          <Box
            display="flex"
            className="centerFilter"
            alignItems="center"
            maxWidth="80vw"
            marginLeft="10vw"
          >
            <TextField
              defaultValue={props.searchCity}
              variant="outlined"
              inputProps={{ style: { fontSize: 15 } }}
              inputStyle={{ fontSize: "15px" }}
              margin="normal"
              helperText="Град/Район"
              placeholder="Без значение"
              className="filter"
              onChange={(e) => props.setSearchCity(e.target.value)}
            />
            <FormControl variant="outlined">
              <Select
                onChange={(e) => props.setSearchCategory(e.target.value)}
                defaultValue={props.searchCategory}
                labelId="category-label"
                id="category"
              >
                <MenuItem value={1}>
                  <em>Без значение</em>
                </MenuItem>
                <MenuItem value={2}>Заведение</MenuItem>
                <MenuItem value={3}>Нощно заведение</MenuItem>
                <MenuItem value={4}>Магазин</MenuItem>
                <MenuItem value={5}>Пътека</MenuItem>
                <MenuItem value={6}>Място</MenuItem>
                <MenuItem value={7}>Друго</MenuItem>
              </Select>
              <FormHelperText>Категория</FormHelperText>
            </FormControl>
            <FormControl variant="outlined">
              <Select
                onChange={(e) => props.setSearchPrice(e.target.value)}
                defaultValue={props.searchPrice}
                labelId="price-label"
                id="price"
              >
                <MenuItem value={1}>
                  <em>Без значение/Не се отнася</em>
                </MenuItem>
                <MenuItem value={2}>Ниска</MenuItem>
                <MenuItem value={3}>Нормална</MenuItem>
                <MenuItem value={4}>Висока</MenuItem>
              </Select>
              <FormHelperText>Цена</FormHelperText>
            </FormControl>
            <FormControl variant="outlined">
              <Select
                onChange={(e) => props.setSearchDangerous(e.target.value)}
                defaultValue={props.searchDangerous}
                labelId="dangerous-label"
                id="price"
              >
                <MenuItem value={1}>
                  <em>Без значение/Не се отнася</em>
                </MenuItem>
                <MenuItem value={2}>Не е опасно</MenuItem>
                <MenuItem value={3}>Малко опасно</MenuItem>
                <MenuItem value={4}>Висока опасност</MenuItem>
              </Select>
              <FormHelperText>Опасно</FormHelperText>
            </FormControl>
            <FormControl variant="outlined">
              <Select
                defaultValue={props.searchAccessibility}
                labelId="accessibility-label"
                id="accessibility"
                onChange={(e) => props.setSearchAccessibility(e.target.value)}
              >
                <MenuItem value={1}>
                  <em>Без значение/Не се отнася</em>
                </MenuItem>
                <MenuItem value={2}>Достъп с инвалидни колички</MenuItem>
                <MenuItem value={3}>Леснодостъпно</MenuItem>
                <MenuItem value={4}>Средно трудно</MenuItem>
                <MenuItem value={5}>Труднодостъпно</MenuItem>
              </Select>
              <FormHelperText>Достъпност</FormHelperText>
            </FormControl>
          </Box>
        )}
        <center>
          <Typography style={{ marginBottom: "3vmax" }} variant="h5">
            {props.searchLoading == 2 ? (
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
            ) : props.searchLoading == 3 ? (
              props.searchQueryDataLength == 0 ? (
                "Няма резултати"
              ) : props.searchQueryDataLength == 1 ? (
                "1 резултат"
              ) : props.searchQueryDataLength == 2 ? (
                "2 резултата"
              ) : (
                props.searchQueryDataLength + " резултати"
              )
            ) : (
              ""
            )}
          </Typography>
        </center>
        {props.searchQueryDataLength == 0 && props.searchLoading == 3 && (
          <img
            src={require("../images/notFound.svg").default}
            className="noResultsBanner"
          />
        )}
        {(props.searchLoading == 3 || props.searchLoading == 1) &&
          props.queryData.length && (
            <FadeIn
              transitionDuration={600}
              delay={100}
              className="CardContainer"
            >
              {
                <div className="MapContainer">
                  {props.queryData.length && (
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
                          props.queryData.map((el) => (
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
                                    setChange={setChange}
                                    change={change}
                                    inSearch={true}
                                    places={places}
                                    setPlaces={setPlaces}
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
                                    liked={
                                      el[1][0].liked == "true" ? true : false
                                    }
                                    saved={
                                      el[1][0].saved == "true" ? true : false
                                    }
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
                            : props.queryData.map((el) => {
                                return (
                                  <Overlay
                                    offset={[0, 50]}
                                    anchor={el[0].placelocation
                                      .replace(/\s+/g, "")
                                      .split(",")
                                      .map(Number)}
                                  >
                                    <Card
                                      setChange={setChange}
                                      change={change}
                                      inSearch={true}
                                      places={props.queryData}
                                      setPlaces={setPlaces}
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
                                      liked={
                                        el[0].liked == "true" ? true : false
                                      }
                                      saved={
                                        el[0].saved == "true" ? true : false
                                      }
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
                  )}
                  {
                    <>
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
                            onChange={(e) =>
                              setLocationChecked(e.target.checked)
                            }
                          />
                          <Typography>Сортирай по близост</Typography>
                          <Checkbox
                            trackColor={{ true: "red", false: "grey" }}
                            checked={markersChecked}
                            onChange={(e) =>
                              setMarkersChecked(e.target.checked)
                            }
                          />
                          <Typography>Маркери</Typography>
                          <Checkbox
                            checked={placesChecked}
                            onChange={(e) => setPlacesChecked(e.target.checked)}
                          />
                          <Typography>Места</Typography>
                        </div>
                      </Box>
                    </>
                  }
                </div>
              }

              {places.length && locationChecked
                ? places.map((el) => {
                    return (
                      <>
                        {!props.admin && (
                          <>
                            {Number(el[1][0].place_id) % 4 == 0 && (
                              <Poems
                                available={availablePoem}
                                setAvailable={setAvailablePoem}
                              />
                            )}
                            {Number(el[1][0].place_id) % 2 == 0 && (
                              <Quotes
                                available={available}
                                setAvailable={setAvailable}
                              />
                            )}
                          </>
                        )}
                        <Card
                          setChange={setChange}
                          change={change}
                          places={places}
                          setPlaces={setPlaces}
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
                          images={el[1]}
                          saveButtonVisible={verify()}
                          adminRights={el[1][0].user_id == ID()}
                          distance={el[0]}
                          date={el[1][0].date}
                        />
                      </>
                    );
                  })
                : props.queryData.map((el) => {
                    return (
                      <>
                        {!props.admin && (
                          <>
                            {Number(el[0].place_id) % 4 == 0 && (
                              <Poems
                                available={availablePoem}
                                setAvailable={setAvailablePoem}
                              />
                            )}
                            {Number(el[0].place_id) % 5 == 0 && (
                              <Quotes
                                available={available}
                                setAvailable={setAvailable}
                              />
                            )}
                          </>
                        )}
                        <Card
                          setChange={setChange}
                          change={change}
                          places={props.queryData}
                          setPlaces={setPlaces}
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
                  })}
            </FadeIn>
          )}
        {props.searchLoading == 3 &&
          props.searchQueryDataLength !== 0 &&
          props.queryData.length < props.searchQueryDataLength && (
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
                  props.setSearchQueryLimit(props.searchQueryLimit + 10);
                }}
                startIcon={<AddIcon />}
              >
                Зареди още
              </Button>
            </Box>
          )}
      </div>
    </ThemeProvider>
  );
};
export default Search;
