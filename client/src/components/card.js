import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import PureModal from "react-pure-modal";
import "react-pure-modal/dist/react-pure-modal.min.css";
import DialogActions from "@material-ui/core/DialogActions";
import { Carousel } from "react-responsive-carousel";
import ReportOutlinedIcon from "@material-ui/icons/ReportOutlined";
import ShareOutlinedIcon from "@material-ui/icons/ShareOutlined";
import FavoriteOutlinedIcon from "@material-ui/icons/FavoriteOutlined";
import BookmarkOutlinedIcon from "@material-ui/icons/BookmarkOutlined";
import ToggleIcon from "material-ui-toggle-icon";
import { Map, Marker, ZoomControl } from "pigeon-maps";
import isValidCoords from "is-valid-coords";
import LinkIcon from "@material-ui/icons/Link";
import Weather from "./weather";
import Comments from "./comments";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import { confirmAlert } from "react-confirm-alert";
import Report from "./report";
import jwt_decode from "jwt-decode";
import Share from "./share";
import Edit from "./edit";
import moment from "moment";
import TooltipImage from "./tooltipImage";
import Image from "material-ui-image";
const axios = require("axios");

const CardElement = (props) => {
  const [openReport, setReportOpen] = React.useState(false);
  const [openShare, setShareOpen] = React.useState(false);
  const [openEdit, setEditOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [weather, setWeather] = React.useState({});
  const [liked, setLiked] = React.useState(props.liked);
  const [saved, setSaved] = React.useState(props.saved);
  const [comments, setComments] = React.useState([]);
  const [likedNumbers, setLikedNumbers] = React.useState(props.numbersLiked);

  React.useEffect(() => {
    if (!localStorage.getItem("jwt")) {
      return false;
    }
    if (!props.inSearch) {
      if (props.change.length && !props.change.includes(Number(props.idData))) {
        return false;
      } else if (props.change.includes(Number(props.idData))) {
        axios
          .request({
            method: "GET",
            url: "http://localhost:5000/places/liked/saved",
            headers: {
              jwt: localStorage.getItem("jwt"),
            },
            params: {
              place_id: props.idData,
            },
          })
          .then((data) => {
            if (data.data) {
              setLiked(data.data["liked"] == "true");
              setSaved(data.data["saved"] == "true");
              setLikedNumbers(Number(data.data["likednumber"]));
            } else {
              setLiked(false);
              setSaved(false);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const category = (num) => {
    switch (Number(num)) {
      case 2:
        return "Заведение";
        break;
      case 3:
        return "Нощно заведение";
        break;
      case 4:
        return "Магазин";
        break;
      case 5:
        return "Пътека";
        break;
      case 6:
        return "Място";
        break;
      case 7:
        return "Друго";
        break;
      default:
        return "Без категория";
    }
  };
  const dangerous = (num) => {
    switch (Number(num)) {
      case 1:
        return "Не е опасно";
        break;
      case 2:
        return "Малко опасно";
        break;
      case 3:
        return "Средно опасно";
        break;
      case 4:
        return "Много опасно";
        break;
      default:
        return "Без дефиниция";
    }
  };
  const price = (num) => {
    switch (Number(num)) {
      case 2:
        return "Ниска";
        break;
      case 3:
        return "Нормална";
        break;
      case 4:
        return "Висока";
        break;
      default:
        return "Без определение";
    }
  };
  const accessibility = (num) => {
    switch (Number(num)) {
      case 2:
        return "Достъп с инвалидни колички";
        break;
      case 3:
        return "Леснодостъпно";
        break;
      case 4:
        return "Средно трудно";
        break;
      case 5:
        return "Труднодостъпно";
        break;
      default:
        return "Без определение";
    }
  };
  const like = async (id) => {
    let a = jwt_decode(localStorage.getItem("jwt"));
    if (a.Username == props.username) {
      props.toast.warn("Не може да харесте място, което сте създали", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return false;
    } else {
      setLiked(true);
      setLikedNumbers((prev) => prev + 1);
    }
    axios
      .request({
        method: "POST",
        url: `http://localhost:5000/like`,
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
        data: {
          place_id: id,
        },
      })
      .catch(async (err) => {
        setLiked(false);
        setLikedNumbers((prev) => prev - 1);
        if (err.response.status == 406) {
          props.toast.warn("Вече сте харесали това място", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (err.response.status == 403) {
          props.toast.warn("Не може да харесте място, което сте създали", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (err.response.status == 401) {
          props.toast.warn("За да харесате място трябва да сте регистрирани", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
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
        }
      });
  };
  const isAdmin = () => {
    try {
      let a = jwt_decode(localStorage.getItem("jwt"));
      if (Boolean(a.admin)) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  };
  const unlike = async (id) => {
    setLiked(false);
    setLikedNumbers((prev) => prev - 1);
    axios
      .request({
        method: "POST",
        url: `http://localhost:5000/unlike`,
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
        data: {
          place_id: id,
        },
      })
      .catch(async (err) => {
        console.error(err);
        setLiked(true);
        setLikedNumbers((prev) => prev + 1);
        if (err.response.status == 406) {
          console.warn("Вече сте отхаресали това място");
        } else if (err.response.status == 401) {
          console.warn("За да отхаресате място трябва да сте регистрирани");
        } else {
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
        }
      });
  };
  const save = (id) => {
    setSaved(true);
    axios
      .request({
        method: "POST",
        url: `http://localhost:5000/save`,
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
        data: {
          place_id: id,
        },
      })
      .catch((err) => {
        setSaved(false);
        if (err.response.status == 406) {
          console.warn("Вече сте запазили това място");
        } else if (err.response.status == 401) {
          console.warn("За да запазите място трябва да сте регистрирани");
        } else {
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
        }
      });
  };
  const unsave = (id) => {
    setSaved(false);
    axios
      .request({
        method: "POST",
        url: `http://localhost:5000/unsave`,
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
        data: {
          place_id: id,
        },
      })

      .catch((err) => {
        setSaved(true);
        if (err.response.status == 406) {
          console.warn("Вече сте премахнали това място от запазени");
        } else if (err.response.status == 401) {
          console.warn(
            "За да премахнете това място от запазени трябва да сте регистрирани"
          );
        } else {
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
        }
      });
  };
  const likeSwitcher = (id) => {
    if (!props.demo) {
      if (liked) {
        unlike(id);
      } else {
        like(id);
      }
    }
  };
  const saveSwitcher = (id) => {
    if (!props.demo) {
      if (saved) {
        unsave(id);
      } else {
        save(id);
      }
    }
  };
  const getWeather = () => {
    axios
      .get("http://localhost:5000/weather", {
        params: {
          latitude: props.placelocation
            .replace(/\s+/g, "")
            .split(",")
            .map(Number)[0],
          longtitude: props.placelocation
            .replace(/\s+/g, "")
            .split(",")
            .map(Number)[1],
        },
      })
      .then((data) => {
        setWeather(data.data);
      });
  };
  const getComments = () => {
    if (props.demo) {
      return false;
    }
    axios
      .request("http://localhost:5000/comments", {
        params: {
          place_id: props.idData,
        },
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
      })
      .then((data) => {
        setComments(data.data);
      });
  };
  const verify = () => {
    try {
      let a = jwt_decode(localStorage.getItem("jwt"));
      return a.Authorized ? true : false;
    } catch (err) {
      return false;
    }
  };
  const [visible, setVisible] = React.useState(true);
  const deletePlace = () => {
    axios
      .delete("http://localhost:5000/place", {
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
        data: {
          place_id: props.idData,
        },
      })
      .then(() => {
        props.toast("Мястото е изтрито.", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setVisible(false);
      })
      .catch(() => {
        props.toast.error(
          "Имаше грешка при изтриването. Пробвайте отново по-късно",
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
    if (open) {
      getWeather();
      getComments();
    }
  }, [open]);
  return (
    <div
      style={{
        opacity: visible ? 1 : 0.3,
        filter: !visible ? "blur(1.5px)" : "none",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <Card
        style={{
          width: props.inMap && "200px",
        }}
        className="card"
      >
        <CardActionArea
          onClick={() => {
            handleClickOpen();
          }}
        >
          {!props.demo && props.mainImg && (
            <CardMedia
              className="mediaImgOverview"
              style={{ height: props.inMap && "100px" }}
              image={"http://localhost:5000/image/" + props.mainImg}
              title="Главно изображение"
            />
          )}
          {props.demo && props.files.length && (
            <CardMedia
              className="mediaImgOverview"
              component={() => (
                <Image
                  imageStyle={{ height: "28.5vh" }}
                  src={URL.createObjectURL(props.files[0])}
                  aspectRatio={16 / 9}
                />
              )}
              title="Главно изображение"
            />
          )}

          <CardContent>
            <Typography
              style={{ textAlign: !props.inMap ? "left" : "center" }}
              gutterBottom
              component={props.inMap ? "h3" : "h2"}
              component={props.inMap ? "h3" : "h2"}
            >
              {props.title}
            </Typography>
            <Typography
              style={{ textAlign: "left" }}
              variant="body2"
              color="textSecondary"
              component="p"
            >
              {!props.inMap &&
                (props.description.length > 45
                  ? props.description.substring(0, 45) + "..."
                  : props.description)}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions
          style={{ display: props.inMap && "none" }}
          className="ButtonHolder"
        >
          <Box className="likesContainer">
            {props.likeButtonVisible && (
              <ToggleIcon
                style={{ color: liked && "#E53935" }}
                on={liked}
                onIcon={
                  <FavoriteOutlinedIcon
                    style={{ color: "red" }}
                    onClick={() => likeSwitcher(props.idData)}
                  />
                }
                offIcon={
                  <FavoriteBorderIcon
                    style={{ color: "red" }}
                    onClick={() => likeSwitcher(props.idData)}
                  />
                }
              />
            )}
            <Typography
              style={{
                marginLeft: props.likeButtonVisible ? 0 : "0.2vmax",
                userSelect: "none",
              }}
            >
              {likedNumbers}
            </Typography>
          </Box>
          <Box style={{ display: "flex", userSelect: "none" }}>
            <TooltipImage author={props.username} avatar={props.avatar} />
          </Box>
          <Box>
            {props.saveButtonVisible && (
              <ToggleIcon
                style={{ color: saved && "#FFD700" }}
                on={saved}
                onIcon={
                  <BookmarkOutlinedIcon
                    onClick={() => saveSwitcher(props.idData)}
                  />
                }
                offIcon={
                  <BookmarkBorderIcon
                    onClick={() => saveSwitcher(props.idData)}
                  />
                }
              />
            )}
          </Box>
        </CardActions>
      </Card>
      <Dialog
        maxWidth="md"
        onClose={handleClose}
        aria-labelledby=""
        open={open}
      >
        <DialogTitle id="MoreInfo" onClose={handleClose}>
          {props.title}
        </DialogTitle>
        <DialogContent dividers>
          {props.images.length ? (
            <Carousel infiniteLoop="true">
              {!props.demo &&
                props.images[0].url &&
                props.images.map((el) => (
                  <div key={Math.random()}>
                    <img
                      alt=""
                      src={"http://localhost:5000/image/" + el.url}
                      aspectRatio={16 / 9}
                    />
                    <p className="legend">{el.caption}</p>
                  </div>
                ))}
            </Carousel>
          ) : (
            <center>Всички снимки се показват след публикуване</center>
          )}

          <Typography gutterBottom>
            <Typography>
              <b>Категория: </b>
              {category(props.category)}
              <b> Опасно: </b>
              {dangerous(props.dangerous)}
              <b> Цена: </b>
              {price(props.price)} <b> Достъпност: </b>
              {accessibility(props.accessibility)}
            </Typography>
            {props.description}
          </Typography>
          {isValidCoords(props.placelocation) && (
            <Box>
              <Map
                metaWheelZoom={true}
                metaWheelZoomWarning={
                  "Използвайте ctrl+scroll, за да промените мащаба"
                }
                height={500}
                defaultCenter={props.placelocation
                  .replace(/\s+/g, "")
                  .split(",")
                  .map(Number)}
                defaultZoom={16}
              >
                <ZoomControl />
                <Marker
                  anchor={props.placelocation
                    .replace(/\s+/g, "")
                    .split(",")
                    .map(Number)}
                  color="red"
                  width={50}
                />
              </Map>
              <Button
                startIcon={<LinkIcon />}
                style={{
                  textTransform: "none",
                }}
                target="_blank"
                href={"https://maps.google.com/maps?q=" + props.placelocation}
              >
                Google Maps
              </Button>
              {Number(Object.keys(weather).length) !== 0 && (
                <Weather data={weather} />
              )}
            </Box>
          )}
          <center className="userCards">
            {props.username && (
              <Box
                style={{
                  display: "inline-flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  padding: "0.5vmax",
                  borderRadius: "1vmax",
                  margin: "2vmax",
                }}
                className="userProfileGradient"
              >
                <TooltipImage author={props.username} avatar={props.avatar} />
              </Box>
            )}
            {props.date && (
              <Box
                style={{
                  display: "inline-flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  padding: "1vmax",
                  borderRadius: "1vmax",
                  margin: "2vmax",
                }}
                className="userProfileGradient"
              >
                <Typography style={{ marginRight: "0.5vmax", color: "white" }}>
                  {"Датата на публикация е " +
                    moment(props.date).locale("bg").format("LL")}
                </Typography>
              </Box>
            )}
            {props.distance && (
              <Box
                style={{
                  display: "inline-flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  padding: "1vmax",
                  borderRadius: "1vmax",
                  margin: "2vmax",
                }}
                className="userProfileGradient"
              >
                <Typography style={{ marginRight: "0.5vmax", color: "white" }}>
                  {props.distance < 1000
                    ? "Мястото е на " + props.distance + " метра"
                    : "Мястото е на " +
                      (props.distance / 1000).toFixed(1) +
                      " км"}
                </Typography>
              </Box>
            )}
          </center>
          {!props.demo && (
            <Comments
              getComments={getComments}
              data={comments}
              place_id={props.idData}
              toast={props.toast}
              idData={props.idData}
            />
          )}
        </DialogContent>
        <DialogActions className="btnCard">
          <Box className="likesContainer">
            {props.likeButtonVisible ? (
              <ToggleIcon
                style={{ color: liked && "#E53935" }}
                on={liked}
                onIcon={
                  <FavoriteOutlinedIcon
                    style={{ fill: "green" }}
                    onClick={() => likeSwitcher(props.idData)}
                  />
                }
                offIcon={
                  <FavoriteBorderIcon
                    style={{ fill: "green" }}
                    onClick={() => likeSwitcher(props.idData)}
                  />
                }
              />
            ) : (
              ""
            )}
            <Typography
              style={{
                marginLeft: props.likeButtonVisible ? 0 : "0.2vmax",
                userSelect: "none",
              }}
            >
              {likedNumbers == 0
                ? "Няма харесвания"
                : likedNumbers == 1
                ? "1 харесване"
                : likedNumbers + " харесвания"}
            </Typography>
          </Box>

          <Box className="endButtons">
            {props.saveButtonVisible && (
              <ToggleIcon
                style={{ color: saved && "#FFD700" }}
                on={saved}
                onIcon={
                  <BookmarkOutlinedIcon
                    onClick={() => saveSwitcher(props.idData)}
                  />
                }
                offIcon={
                  <BookmarkBorderIcon
                    onClick={() => saveSwitcher(props.idData)}
                  />
                }
              />
            )}
            <ShareOutlinedIcon onClick={() => setShareOpen(!openShare)} />
            {(props.adminRights || isAdmin()) && (
              <EditOutlinedIcon onClick={() => setEditOpen(!openEdit)} />
            )}
            {props.reportButtonVisible && verify() && (
              <ReportOutlinedIcon onClick={() => setReportOpen(!openReport)} />
            )}
            {!props.demo && (
              <>
                <PureModal
                  header="Редактирай"
                  isOpen={openEdit}
                  onClose={() => {
                    setEditOpen(false);
                    return true;
                  }}
                >
                  <Edit
                    close={setEditOpen}
                    toast={props.toast}
                    images={props.images}
                    name={props.title}
                    description={props.description}
                    placelocation={props.placelocation}
                    category={props.category}
                    dangerous={props.dangerous}
                    price={props.price}
                    city={props.city}
                    accessibility={props.accessibility}
                    item_id={props.idData}
                  />
                </PureModal>

                <PureModal
                  header="Сподели"
                  isOpen={openShare}
                  onClose={() => {
                    setShareOpen(false);
                    return true;
                  }}
                >
                  <Share
                    toast={props.toast}
                    name={props.title}
                    description={
                      props.description.length > 100
                        ? props.description.substring(0, 100) + "..."
                        : props.description
                    }
                    item_id={props.idData}
                  />
                </PureModal>

                <PureModal
                  header="Съобщи за нередност"
                  isOpen={openReport}
                  onClose={() => {
                    setReportOpen(false);
                    return true;
                  }}
                >
                  <Report
                    toast={props.toast}
                    setReportOpen={setReportOpen}
                    item_id={props.idData}
                    type="place"
                  />
                </PureModal>
              </>
            )}
            {(props.adminRights || isAdmin()) && (
              <DeleteOutlineOutlinedIcon
                onClick={() => {
                  !props.demo &&
                    confirmAlert({
                      title: "Потвърдете",
                      message:
                        "Сигурен ли сте, че искате да изтриете мястото? Това решение не може да се върне назад",
                      buttons: [
                        {
                          label: "Да",
                          onClick: () => deletePlace(),
                        },
                        {
                          label: "Не",
                        },
                      ],
                    });
                }}
              />
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default CardElement;
