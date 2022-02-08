import React from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "@material-ui/core/Link";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import jwt_decode from "jwt-decode";
import ImageIcon from "@material-ui/icons/Image";
import { useHistory } from "react-router-dom";
import Conditions from "./conditions";

import Switch from "@material-ui/core/Switch";
import Checkbox from "@material-ui/core/Checkbox";
import { confirmAlert } from "react-confirm-alert";
import PureModal from "react-pure-modal";
import Name from "./changeName";
import Avatar from "./changeAvatar";
import Email from "./changeEmail";
import Password from "./changePassword";
import Delete from "./deleteProfile";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { Map, Marker, ZoomControl, Overlay } from "pigeon-maps";
import Settings from "@material-ui/icons/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@material-ui/core/IconButton";
import HailIcon from "@mui/icons-material/Hail";
import InsightsIcon from "@mui/icons-material/Insights";
import NotesIcon from "@mui/icons-material/Notes";
import Tooltip from "@mui/material/Tooltip";
import SuggestedPlaces from "./suggestedPlaces";
import CardComponent from "./card";
import UserStats from "./userStats";
import NotesViewer from "./notesViewer";

import { getCenter, getPreciseDistance } from "geolib";

const axios = require("axios");

const Profile = (props) => {
  const history = useHistory();
  const [openEmail, setOpenEmail] = React.useState(false);
  const [openAvatar, setOpenAvatar] = React.useState(false);
  const [openDelete, setDelete] = React.useState(false);
  const [openPassword, setOpenPassword] = React.useState(false);
  const [openName, setOpenName] = React.useState(false);
  const [userData, setUserData] = React.useState([]);
  const [viewcount, setViewCount] = React.useState(25);
  const [count, setUserCount] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const [places, setPlaces] = React.useState([]);
  const [avatar, setAvatar] = React.useState();
  const [suggestionsOpen, setSuggestionsOpen] = React.useState(false);
  const [insightsOpen, setInsightsOpen] = React.useState(false);
  const [notesOpen, setNotesOpen] = React.useState(false);
  const [location, setLocation] = React.useState();
  const [markersChecked, setMarkersChecked] = React.useState(true);
  const [placesChecked, setPlacesChecked] = React.useState(true);
  const [center, setCenter] = React.useState();
  const [openConditions, setOpenConditions] = React.useState(false);
  const [locationChecked, setLocationChecked] = React.useState(
    location ? true : false
  );

  const [change, setChange] = React.useState([]);
  const getCenterCoordinates = () => {
    if (userData.length) {
      let locationsArray = userData.map((el) => {
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
  }, [userData]);
  React.useEffect(() => {
    toSort();
  }, [location, userData]);
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

  const toSort = (arr = userData) => {
    if (!userData || !location) {
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

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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
  React.useLayoutEffect(() => {
    axios
      .get("https://unpopular-backend.herokuapp.com/count", {
        headers: { jwt: localStorage.getItem("jwt") },
      })
      .then((data) => {
        if (data.data) {
          setUserCount(Number(data.data));
        } else {
          setUserCount(0);
        }
      })
      .catch((err) => {
        toast.error("Не успяхме да получим данните от сървъра", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  }, []);
  React.useLayoutEffect(() => {
    getUserCards();
  }, []);
  React.useLayoutEffect(() => {
    getUserCards(viewcount + 1, 0);
    if (viewcount < count) {
      //   setMoreVisible(true);
    }
  }, [viewcount]);
  React.useLayoutEffect(() => {
    axios
      .request({
        method: "GET",
        url: `https://unpopular-backend.herokuapp.com/avatar`,
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
      })
      .then((data) => {
        if (data.data.length) {
          setAvatar(data.data);
        }
      });
  }, []);
  const getUserCards = () => {
    setChange([]);

    axios
      .request({
        method: "POST",
        url: `https://unpopular-backend.herokuapp.com/user/places`,
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
        data: {
          limit: viewcount,
        },
      })
      .then((data) => {
        if (data.data.length) {
          setAvatar(data.data[0][0].avatar);
          setUserData(data.data);
        }
      })
      .catch((err) => {
        toast.error("Не успяхме да получим данните от сървъра", {
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

  const logOut = () => {
    try {
      localStorage.removeItem("jwt");
      history.push("/search");
      toast("Излезнахте от профила си", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      toast.error("Неспецифична грешка", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return false;
    }
  };
  const deleteProfile = () => {
    axios
      .request({
        url: "https://unpopular-backend.herokuapp.com/user/delete",
        method: "DELETE",
        headers: { jwt: localStorage.getItem("jwt") },
      })
      .then((data) => {
        localStorage.removeItem("jwt");
        toast("Профилът е изтрит", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        history.push("/search");
      })
      .catch((err) => {
        toast.error("Имаше сървърна грешка. Пробвайте отново по-късно", {
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
  const downloadData = () => {
    axios
      .request({
        url: `https://unpopular-backend.herokuapp.com/user/data/`,
        method: "GET",
        responseType: "blob",
        headers: { jwt: localStorage.getItem("jwt") },
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Потребителска информация.zip`);
        document.body.appendChild(link);
        link.click();
        props.toast(
          "Изтеглянето се стартира. Ако имате места с нетипични символи като емотикони е възможно да не можете да разархивирате файла. Дори и без да го разархивирате ще можете да преглеждате местата, които сте запазили.",
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
      })
      .catch((err) => {
        props.error(
          "Имаше грешка при изтеглянето. Пробвайте отново по-късно ",
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
  const downloadNotes = () => {
    axios
      .request({
        method: "GET",
        url: "https://unpopular-backend.herokuapp.com/all/notes",
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
      })
      .then(async (response) => {
        const myData = response.data;
        const fileName = "file";
        const json = JSON.stringify(myData);
        const blob = new Blob([json], { type: "application/json" });
        const href = await URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        props.toast("Изтеглянето се стартира.", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        props.error(
          "Имаше грешка при изтеглянето. Пробвайте отново по-късно ",
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
  return (
    <div>
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
      <Container style={{ marginTop: "2vmax" }} maxWidth="lg">
        <Typography align="center" variant="h3">
          {jwt_decode(localStorage.getItem("jwt")).Username}
        </Typography>
        <center style={{ margin: "1vmax" }}>
          {avatar || files[0] !== undefined ? (
            <img
              draggable="false"
              style={{ borderRadius: "50%", width: "10vmax", height: "10vmax" }}
              className="avatarProfile"
              src={
                files[0] !== undefined
                  ? URL.createObjectURL(files[0])
                  : "" + avatar
              }
              alt={"Имаше проблем при зареждането на аватара"}
            />
          ) : (
            <i> Не искаш ли да си сложиш аватор? Посети настройки!</i>
          )}
        </center>
        <center>
          <Tooltip title="Предложения">
            <IconButton
              onClick={() => {
                setSuggestionsOpen((prev) => !prev);
              }}
              children={<HailIcon />}
            />
          </Tooltip>
          <Tooltip title="Информация">
            <IconButton
              onClick={() => {
                setInsightsOpen((prev) => !prev);
              }}
              children={<InsightsIcon />}
            />
          </Tooltip>
          <Tooltip title="Записки">
            <IconButton
              children={<NotesIcon />}
              onClick={() => {
                setNotesOpen((prev) => !prev);
              }}
            />
          </Tooltip>
          <Tooltip title="Настройки">
            <IconButton onClick={handleClickOpen} children={<Settings />} />
          </Tooltip>
          <Tooltip title="Излез от профила">
            <IconButton onClick={logOut} children={<LogoutIcon />} />
          </Tooltip>
        </center>
        <Box className="insights">
          <PureModal
            header=""
            onClose={() => {
              setInsightsOpen(false);
            }}
            isOpen={insightsOpen}
          >
            <UserStats />
          </PureModal>
        </Box>
        <PureModal
          className="suggestions"
          header="Предложения"
          isOpen={suggestionsOpen}
          onClose={() => {
            setSuggestionsOpen(false);
          }}
        >
          <SuggestedPlaces />
        </PureModal>
        <PureModal
          className="suggestions"
          header="Записки"
          isOpen={notesOpen}
          onClose={() => {
            setNotesOpen(false);
          }}
        >
          <NotesViewer />
        </PureModal>
        <Dialog
          maxWidth="md"
          onClose={handleClose}
          aria-labelledby="MoreInfo"
          open={open}
        >
          <DialogTitle onClose={handleClose}>
            <center>
              <Typography variant="h4">Настройки</Typography>
            </center>
          </DialogTitle>
          <DialogContent
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              style={{ textTransform: "none", margin: "0.5vmax" }}
              variant="outlined"
              onClick={logOut}
            >
              Излез от профила
            </Button>
            <Button
              style={{ textTransform: "none", margin: "0.5vmax" }}
              variant="outlined"
              onClick={() => {
                setOpenAvatar(!openAvatar);
              }}
            >
              Промени аватар
            </Button>
            <PureModal
              header="Промени аватар"
              isOpen={openAvatar}
              onClose={() => {
                setOpenAvatar(!openAvatar);
                return true;
              }}
            >
              <Avatar
                files={files}
                setFiles={setFiles}
                setAvatar={setAvatar}
                toast={toast}
                avatar={avatar}
                setOpenAvatar={setOpenAvatar}
              />
            </PureModal>

            <PureModal
              header="Промени парола"
              isOpen={openPassword}
              onClose={() => {
                setOpenPassword(!openPassword);
                return true;
              }}
            >
              <Password toast={toast} setOpenEmail={setOpenEmail} />
            </PureModal>
            <Button
              style={{ textTransform: "none", margin: "0.5vmax" }}
              variant="outlined"
              onClick={() => setOpenPassword(!openPassword)}
            >
              Промени парола
            </Button>
            <Button
              style={{ textTransform: "none", margin: "0.5vmax" }}
              variant="outlined"
              onClick={() => setOpenEmail(!openEmail)}
            >
              Промени имейл
            </Button>
            <PureModal
              header="Промени имейл"
              isOpen={openEmail}
              onClose={() => {
                setOpenEmail(!openEmail);
                return true;
              }}
            >
              <Email toast={toast} setOpenEmail={setOpenEmail} />
            </PureModal>
            <Button
              style={{ textTransform: "none", margin: "0.5vmax" }}
              variant="outlined"
              onClick={() => setOpenName(!openName)}
            >
              Промени име
            </Button>
            <PureModal
              header="Промени име"
              isOpen={openName}
              onClose={() => {
                setOpenName(!openName);
                return true;
              }}
            >
              <Name toast={toast} setOpenName={setOpenName} axios={axios} />
            </PureModal>
            {userData.length ? (
              <Button
                style={{ textTransform: "none", margin: "0.5vmax" }}
                variant="outlined"
                onClick={() => {
                  confirmAlert({
                    title: "Потвърдете",
                    message: "Да започнем ли стартирането сега?",
                    buttons: [
                      {
                        label: "Да",
                        onClick: () => downloadData(),
                      },
                      {
                        label: "Не",
                      },
                    ],
                  });
                }}
              >
                Изтегли качените места
              </Button>
            ) : (
              ""
            )}

            {
              <Button
                style={{ textTransform: "none", margin: "0.5vmax" }}
                variant="outlined"
                onClick={() => {
                  confirmAlert({
                    title: "Потвърдете",
                    message: "Да започнем ли стартирането сега?",
                    buttons: [
                      {
                        label: "Да",
                        onClick: () => downloadNotes(),
                      },
                      {
                        label: "Не",
                      },
                    ],
                  });
                }}
              >
                Изтегли записките
              </Button>
            }

            <Button
              style={{ textTransform: "none", margin: "0.5vmax" }}
              variant="outlined"
              onClick={() => setDelete(true)}
            >
              Изтрий профил
            </Button>
            <center>
              <Link
                component="button"
                href="#"
                variant="body2"
                color="black"
                onClick={() => setOpenConditions(true)}
              >
                Общи условия и Политика за поверителност
              </Link>
            </center>
            <PureModal
              header="Общи условия и Политика за поверителност"
              isOpen={openConditions}
              onClose={() => {
                setOpenConditions(false);
                return true;
              }}
            >
              <Conditions />
            </PureModal>
            <PureModal
              header="Изтрий профил"
              isOpen={openDelete}
              onClose={() => {
                setDelete(!openDelete);
                return true;
              }}
            >
              <Delete toast={toast} setDelete={setDelete} />
            </PureModal>
          </DialogContent>
        </Dialog>
        <Typography gutterBottom align="center" variant="h5">
          Качени: {count}
        </Typography>
        <Divider />
      </Container>
      {count > 10 ? (
        <center>
          <FormControl style={{ margin: "1vmax" }} variant="outlined">
            <Select
              defaultValue={25}
              labelId="accessibility-label"
              id="accessibility"
              onChange={(e) => {
                setViewCount(e.target.value);
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={200}>200</MenuItem>
              <MenuItem value={300}>300</MenuItem>
              <MenuItem value={400}>400</MenuItem>
              <MenuItem value={500}>500</MenuItem>
              <MenuItem value={99999}>Всички</MenuItem>
            </Select>
            <FormHelperText>Брой постове на дисплей</FormHelperText>
          </FormControl>
        </center>
      ) : (
        ""
      )}

      <Box className="CardContainer">
        {userData.length ? (
          <>
            <Box className="MapContainer">
              <center>
                <Map
                  metaWheelZoom={true}
                  metaWheelZoomWarning={
                    "Използвайте ctrl+scroll, за да промените мащаба"
                  }
                  center={location ? location : center}
                  zoom={7}
                  width={"70vw"}
                  height={
                    !(window.innerWidth < window.innerHeight) ? "500px" : "60vh"
                  }
                >
                  <ZoomControl />
                  {locationChecked && location && (
                    <Marker anchor={location} color={"red"} />
                  )}
                  {markersChecked &&
                    userData.map((el) => (
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
                            <Tooltip title="Натиснете, за да видите повече">
                              <CardComponent
                                setChange={setChange}
                                change={change}
                                inSearch={true}
                                places={places}
                                setPlaces={setPlaces}
                                inMap={true}
                                toast={props.toast}
                                key={Math.random()}
                                username={el[1][0].username}
                                views={el[1][0].views}
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
                                username={
                                  jwt_decode(localStorage.getItem("jwt"))
                                    .Username
                                }
                                user_id={el[1][0].user_id}
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
                            </Tooltip>
                          </Overlay>
                        ))
                      : userData.map((el) => {
                          return (
                            <Overlay
                              offset={[0, 50]}
                              anchor={el[0].placelocation
                                .replace(/\s+/g, "")
                                .split(",")
                                .map(Number)}
                            >
                              <Tooltip title="Натиснете, за да видите повече">
                                <CardComponent
                                  setChange={setChange}
                                  change={change}
                                  inSearch={true}
                                  places={userData}
                                  setPlaces={setPlaces}
                                  inMap={true}
                                  date={el[0].date}
                                  views={el[0].views}
                                  toast={props.toast}
                                  key={Math.random()}
                                  user_id={el[0].user_id}
                                  idData={el[0].place_id}
                                  title={el[0].title}
                                  description={el[0].description}
                                  price={el[0].price}
                                  accessibility={el[0].accessibility}
                                  category={el[0].category}
                                  user_id={el[0].user_id}
                                  placelocation={el[0].placelocation}
                                  dangerous={el[0].dangerous}
                                  username={
                                    jwt_decode(localStorage.getItem("jwt"))
                                      .Username
                                  }
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
                                  username={el[0].username}
                                />
                              </Tooltip>
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
            </Box>
          </>
        ) : (
          ""
        )}
        {userData ? (
          locationChecked ? (
            places.map((el) => (
              <CardComponent
                setChange={setChange}
                change={change}
                inSearch={true}
                places={places}
                setPlaces={setPlaces}
                toast={props.toast}
                key={Math.random()}
                username={el[1][0].username}
                views={el[1][0].views}
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
                distance={el[0]}
                user_id={el[1][0].user_id}
                avatar={el[1][0].avatar}
                user_id={el[1][0].user_id}
                likeButtonVisible={verify()}
                reportButtonVisible={true}
                liked={el[1][0].liked == "true" ? true : false}
                saved={el[1][0].saved == "true" ? true : false}
                numbersLiked={Number(el[1][0].likednumber)}
                username={jwt_decode(localStorage.getItem("jwt")).Username}
                mainImg={el[1][0].url}
                city={el[1][0].city}
                images={el[1]}
                saveButtonVisible={verify()}
                adminRights={el[1][0].user_id == ID()}
                date={el[1][0].date}
              />
            ))
          ) : (
            userData.map((el) => {
              return (
                <CardComponent
                  inSearch={true}
                  toast={props.toast}
                  key={Math.random()}
                  username={jwt_decode(localStorage.getItem("jwt")).Username}
                  user_id={el[0].user_id}
                  idData={el[0].place_id}
                  title={el[0].title}
                  views={el[0].views}
                  description={el[0].description}
                  price={el[0].price}
                  accessibility={el[0].accessibility}
                  category={el[0].category}
                  dangerous={el[0].dangerous}
                  placelocation={el[0].placelocation}
                  likeButtonVisible={verify()}
                  reportButtonVisible={true}
                  liked={el[0].liked == "true" ? true : false}
                  saved={el[0].saved == "true" ? true : false}
                  numbersLiked={Number(el[0].likednumber)}
                  city={el[0].city}
                  mainImg={el[0].url}
                  images={el}
                  saveButtonVisible={verify()}
                  adminRights={el[0].user_id == ID()}
                  user_id={el[0].user_id}
                  avatar={el[0].avatar}
                />
              );
            })
          )
        ) : (
          <Typography variant="h5">Зареждане на данни</Typography>
        )}
      </Box>
      {userData.length && count > viewcount ? (
        <Container
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2vmax",
            textTransform: "none",
          }}
          maxWidth="sm"
        >
          <Button
            style={{ textTransform: "none" }}
            onClick={() => {
              setViewCount((prev) => prev + 10);
            }}
            variant="outlined"
          >
            Зареди още
          </Button>
        </Container>
      ) : (
        ""
      )}
    </div>
  );
};

export default Profile;
