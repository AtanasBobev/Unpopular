import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import Switch from "@material-ui/core/Switch";
import { Map, Marker, ZoomControl, Overlay } from "pigeon-maps";
import { getCenter, getPreciseDistance } from "geolib";
import Typography from "@material-ui/core/Typography";
import jwt_decode from "jwt-decode";
import Card from "./card";
import Box from "@material-ui/core/Box";
const MapCard = (props) => {
  const [markersChecked, setMarkersChecked] = React.useState(true);
  const [placesChecked, setPlacesChecked] = React.useState(true);
  const [center, setCenter] = React.useState();

  React.useEffect(() => {
    getCenterCoordinates();
  }, [props.queryData]);
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
  React.useEffect(() => {
    if (!props.queryData || !props.location) {
      return false;
    }
    let myQueryData = [];
    props.queryData.forEach((el) => {
      let distance = getPreciseDistance(
        { latitude: props.location[0], longitude: props.location[1] },
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
      props.setPlaces(myQueryData.sort((a, b) => a[0] - b[0]));
    });
  }, [props.location, props.queryData]);
  React.useEffect(() => {
    if (!props.locationChecked) {
      return false;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (e) => {
          props.setLocation([e.coords.latitude, e.coords.longitude]);
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
  }, [props.locationChecked]);
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
    <div className="MapContainer">
      {props.queryData.length && (
        <center>
          <Map
            metaWheelZoom={true}
            metaWheelZoomWarning={
              "Използвайте ctrl+scroll, за да промените мащаба"
            }
            center={props.location ? props.location : center}
            zoom={7}
            width={"70vw"}
            height={"60vh"}
          >
            <ZoomControl />
            {props.locationChecked && props.location && (
              <Marker anchor={props.location} color={"red"} />
            )}
            {markersChecked &&
              props.location &&
              props.queryData.length &&
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
              (props.places.length && props.locationChecked
                ? props.places.map((el) => (
                    <Overlay
                      offset={[0, 50]}
                      anchor={el[1][0].placelocation
                        .replace(/\s+/g, "")
                        .split(",")
                        .map(Number)}
                    >
                      <Card
                        inMap={true}
                        username={el[1][0].username}
                        toast={props.toast}
                        key={Math.random()}
                        user_id={el[1][0].user_id}
                        date={el[1][0].date}
                        idData={el[1][0].place_id}
                        title={el[1][0].title}
                        description={el[1][0].description}
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
                        images={el}
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
                          inMap={true}
                          date={el[0].date}
                          toast={props.toast}
                          key={Math.random()}
                          username={el[0].username}
                          user_id={el[0].user_id}
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
      )}
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
            checked={props.locationChecked && props.location}
            onChange={(e) => props.setLocationChecked(e.target.checked)}
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
  );
};
export default MapCard;
