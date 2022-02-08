import React from "react";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import ImageIcon from "@material-ui/icons/Image";
import Conditions from "./conditions";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import isValidCoords from "is-valid-coords";
import Card from "./card";
import { useHistory } from "react-router-dom";
import isPointInBulgaria from "./isPointInBulgaria";
import { Map, Marker, ZoomControl } from "pigeon-maps";
import PureModal from "react-pure-modal";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import SwapArray from "swap-array";
import IconButton from "@material-ui/core/IconButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationPicker from "react-leaflet-location-picker";
import moment from "moment";

//Profanity filter
const filter = require("leo-profanity");
filter.loadDictionary("en");

const axios = require("axios");

const Upload = (props) => {
  const history = useHistory();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [city, setCity] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [dangerous, setDangerous] = React.useState("");
  const [accessibility, setAccessibility] = React.useState("");
  const [files, setFiles] = React.useState([]);
  const [location, setLocation] = React.useState("");
  const [token, setToken] = React.useState();
  const [openConditions, setOpenConditions] = React.useState(false);

  const acceptedImageTypes = ["image/jpeg", "image/png", "image/jpg"];

  React.useEffect(() => {
    Array.from(files).forEach((el) => {
      if (!acceptedImageTypes.includes(el["type"])) {
        toast.warn("Позволените формати са jpeg и png.", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setFiles((prev) => prev.filter((b) => b.name !== el.name));
        return false;
      }
      if (el.size > 3e6) {
        toast.warn(
          "Максималният позволен размер е 3МБ. Вашият файл е с размер " +
            (Number(el.size) / 1e6).toFixed(2) +
            " MБ",
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
        setFiles((prev) => prev.filter((b) => Number(b.size) <= 3e6));
        return false;
      }
    });
  }, [files]);
  const Upload = (e) => {
    e.preventDefault();
    if (files.length > 3) {
      toast.warn("Не е позволено да качвате повече от 3 снимки", {
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
    files.some((el) => {
      if (el.size / 1e6 > 3) {
        toast.warn("Не е позволен размер над 3МБ!", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return el.size;
      }
    });
    if (!location || !isValidCoords(location.replace(/\s+/g, "").split(","))) {
      toast.warn(
        "Невалидни координати! Пример за валидни координати е 47.1231231, 179.99999999",
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
    } else {
      if (
        !isPointInBulgaria(
          location.replace(/\s+/g, "").split(",")[0],
          location.replace(/\s+/g, "").split(",")[1]
        )
      ) {
        toast.warn("Координатите не са в България", {
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
      if (filter.check(name)) {
        toast.warn("Името съдържа нецензурни думи", {
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
      if (filter.check(description)) {
        toast.warn("Описанието съдържа нецензурни думи", {
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
      if (!/[а-яА-ЯЁё]/.test(city)) {
        toast.warn("Градът трябва да е на кирилица!", {
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
      if (filter.check(city)) {
        toast.warn("Името на града съдържа нецензурни думи", {
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
      if (name.length > 50) {
        toast.warn("Не може името да е над 50 символа", {
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
      if (name.length < 5) {
        toast.warn("Не може името да е под 5 символа", {
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
      if (description.length > 5000) {
        toast.warn("Не може описанието да е над 5000 символа", {
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
      if (description.length < 10) {
        toast.warn("Не може описанието да е под 10 символа", {
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
      if (location.length < 1) {
        toast.warn("Невалидни координати", {
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
      if (location.length > 50) {
        toast.warn("Не може координатите да са над 50 симолва", {
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
      if (!token) {
        toast.warn("Не сте потвърдили, че не сте робот", {
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

      toast("Моля изчакайте...", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      const data = new FormData();
      data.append("name", name);
      data.append("description", description);
      data.append("city", city);
      data.append("category", category);
      data.append("price", price);
      data.append("accessibility", accessibility);
      data.append("dangerous", dangerous);
      data.append("location", location);
      let filesReady = files;
      Array.from(filesReady).forEach((image) => {
        data.append("images", image);
      });
      axios
        .post("https://unpopular-backend.herokuapp.com/place", data, {
          headers: { jwt: localStorage.getItem("jwt"), token: token },
        })
        .then((res) => {
          history.push("/profile");
          toast("Мястото е качено", {
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
          if (err.response.status == 409) {
            toast.error("Място със същите данни вече съществува!", {
              position: "bottom-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          } else if (err.response.status == 500) {
            toast.error(
              "Проверете си данните! Може да качвате до 3 изображения с размер до 3МБ и текст с дължина до 10 хиляди символа.",
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
          } else if (err.response.status == 401) {
            toast.error(
              "Не сте си потвърдили имейла или не сте потвърдили, че не сте робот!",
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
    }
  };
  const pointMode = {
    banner: false,
    control: {
      values: [],
      onClick: (point) => setLocation(point[0] + "," + point[1]),
    },
  };
  return (
    <Box className="backgroundUpload">
      <Container style={{ display: "flex", justifyContent: "center" }}>
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
        <form
          onSubmit={(e) => {
            Upload(e);
          }}
          className="UploadForm"
        >
          <Typography style={{ textAlign: "center" }} variant="h2">
            Качи място
          </Typography>
          <Typography variant="h5" gutterBottom>
            1. Заглавие{" "}
          </Typography>
          <TextField
            onBlur={(e) => setName(e.target.value)}
            variant="outlined"
            placeholder="Име на мястото (Бар Кула)"
            inputProps={{ maxLength: 50 }}
            required
          />
          <Typography variant="h5" gutterBottom>
            2. Описание{" "}
          </Typography>
          <TextField
            onBlur={(e) => setDescription(e.target.value)}
            className="UploadMain"
            variant="outlined"
            multiline
            rows={10}
            placeholder="Описание (Как изглежда мястото; как се стига до там; какво може да се види...)"
            inputProps={{ maxLength: 5000 }}
            required
          />
          <Typography variant="h5" gutterBottom>
            3. Изберете местоположение
          </Typography>
          <center>
            <LocationPicker
              precision={10}
              showInputs={false}
              pointMode={pointMode}
              mapStyle={{ height: "300px" }}
            />
            {location && (
              <Typography>
                {!isValidCoords(location.replace(/\s+/g, "").split(",")) && (
                  <Box>
                    {" "}
                    <b>
                      Изглежда, че въведените координати не са валидни! Ако
                      изпитвате затруднения, въведете координатите ръчно
                      по-долу.
                    </b>
                  </Box>
                )}
                {!isPointInBulgaria(
                  Number(location.replace(/\s+/g, "").split(",")[0]),
                  Number(location.replace(/\s+/g, "").split(",")[1])
                ) ? (
                  <Box>
                    {" "}
                    <b>
                      Изглежда, че координатите не са в България! Ако изпитвате
                      затруднения, въведете координатите ръчно по-долу.{" "}
                    </b>
                  </Box>
                ) : (
                  "Може да видите местоположението по-долу на картата"
                )}
              </Typography>
            )}
          </center>
          <Typography variant="h5" gutterBottom>
            Или изберете ръчно местоположение
          </Typography>
          <TextField
            onChange={(e) => setLocation(e.target.value)}
            className="UploadMain"
            variant="outlined"
            multiline
            rows={1}
            inputProps={{ maxLength: 100 }}
            placeholder="Координати (52.0003,63.0005)"
          />
          <Typography>
            Координатите трябва да е във формат "52.0003,63.0005". Ако искате
            ръчно да ги въведете, отидете в Google Maps. Натиснете с десен бутон
            върху мястото, за което искате да копирате координатите. Натиснете с
            ляв бутон върху първата опция, която са координатите. Поставете ги в
            полето отгоре. Ако координатите са валидни, ще се появи карта и
            червен маркер на нея. Задължително координатите трябва да са в
            България.
          </Typography>
          {isValidCoords(location.replace(/\s+/g, "").split(",")) &&
            isPointInBulgaria(
              Number(location.replace(/\s+/g, "").split(",")[0]),
              Number(location.replace(/\s+/g, "").split(",")[1])
            ) && (
              <Map
                metaWheelZoom={true}
                metaWheelZoomWarning={
                  "Използвайте ctrl+scroll, за да промените мащаба"
                }
                center={[
                  Number(location.replace(/\s+/g, "").split(",")[0]),
                  Number(location.replace(/\s+/g, "").split(",")[1]),
                ]}
                zoom={5}
                height={"60vh"}
              >
                <ZoomControl />

                <Marker
                  width={50}
                  anchor={[
                    Number(location.replace(/\s+/g, "").split(",")[0]),
                    Number(location.replace(/\s+/g, "").split(",")[1]),
                  ]}
                  color="red"
                />
              </Map>
            )}{" "}
          <Box>
            <Typography variant="h5" gutterBottom>
              4. Категории
            </Typography>
          </Box>
          <TextField
            className="UploadMain"
            variant="outlined"
            inputProps={{ style: { fontSize: 15 } }}
            inputStyle={{ fontSize: "15px" }}
            margin="normal"
            helperText="Град"
            onBlur={(e) => setCity(e.target.value)}
            placeholder="София"
            className="filter"
            inputProps={{ maxLength: 20 }}
            required
          />
          <FormControl variant="outlined">
            <Select
              onBlur={(e) => setCategory(e.target.value)}
              placeholder="Без значение"
              labelId="category-label"
              id="category"
              required
            >
              <MenuItem value={1}>Сграда</MenuItem>
              <MenuItem value={2}>Гледка</MenuItem>
              <MenuItem value={3}>Екотуризъм</MenuItem>
              <MenuItem value={4}>Изкуство</MenuItem>
              <MenuItem value={5}>Заведение</MenuItem>
              <MenuItem value={6}>Друго</MenuItem>
            </Select>
            <FormHelperText>Категория</FormHelperText>
          </FormControl>
          <FormControl variant="outlined">
            <Select
              onBlur={(e) => setPrice(e.target.value)}
              labelId="price-label"
              id="price"
              required
            >
              <MenuItem value="1">
                <em>Не се отнася</em>
              </MenuItem>
              <MenuItem value={2}>Ниска</MenuItem>
              <MenuItem value={3}>Нормална</MenuItem>
              <MenuItem value={4}>Висока</MenuItem>
            </Select>
            <FormHelperText>Цена</FormHelperText>
          </FormControl>
          <FormControl variant="outlined">
            <Select
              onBlur={(e) => setDangerous(e.target.value)}
              labelId="dangerous-label"
              id="price"
              required
            >
              <MenuItem value={1}>Не е опасно</MenuItem>
              <MenuItem value={2}>Малко опасно</MenuItem>
              <MenuItem value={3}>Средно опасно</MenuItem>
              <MenuItem value={4}>Много опасно</MenuItem>
            </Select>
            <FormHelperText>Опасно</FormHelperText>
          </FormControl>
          <FormControl variant="outlined">
            <Select
              onBlur={(e) => setAccessibility(e.target.value)}
              labelId="accessibility-label"
              id="accessibility"
              required
            >
              <MenuItem value={2}>Достъп с инвалидни колички</MenuItem>
              <MenuItem value={3}>Леснодостъпно</MenuItem>
              <MenuItem value={4}>Средно трудно</MenuItem>
              <MenuItem value={5}>Труднодостъпно</MenuItem>
            </Select>
            <FormHelperText>Достъпност</FormHelperText>
          </FormControl>
          <Typography variant="h5" gutterBottom>
            5. Снимки
          </Typography>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={(e) => {
              if (e.target.files.length > 30) {
                toast.error(
                  "Забелязахме, че искате да качите над 30 снимки, което ще забави сесията Ви. Не е позволено качването на повече от 3 снимки с размер до 3 МБ.",
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
                return false;
              }
              setFiles((prev) => {
                return Array.from(Array.from(e.target.files)).concat(prev);
              });
            }}
          />
          <label htmlFor="raised-button-file">
            <Button
              style={{ textTransform: "none" }}
              variant="outlined"
              component="span"
              startIcon={<ImageIcon />}
            >
              {files.length ? "Добави снимки" : "Качи снимки"}
            </Button>
          </label>
          <center>
            {files.length > 1 ? (
              <Typography>
                <i>Първата снимка винаги е заглавна</i>
              </Typography>
            ) : (
              ""
            )}
            {files.length > 3 && <b>Не са позволени повече от 3 снимки</b>}
          </center>
          {Array.from(files).map((image, index) => {
            return (
              <Box
                style={{ width: files.length > 1 ? "45%" : "95%" }}
                className="imageDynamic"
              >
                <Box className="dynamicImageInside">
                  <Typography
                    style={{
                      display: "inline-flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "10px",
                      marginRight: "1vmax",
                    }}
                  >
                    <b>{index + 1 + "   "}</b>
                  </Typography>
                  <Typography
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {image.name}
                  </Typography>

                  <IconButton
                    children={<ArrowDropUpIcon />}
                    style={{
                      display:
                        files.findIndex((x) => x.name == image.name) == 0 &&
                        "none",
                    }}
                    onClick={() => {
                      let index = files.findIndex((x) => x.name == image.name);
                      if (index !== 0) {
                        setFiles((prev) => {
                          return SwapArray(prev, index, index - 1);
                        });
                      }
                    }}
                  ></IconButton>
                  <IconButton
                    children={<ArrowDropDownIcon />}
                    style={{
                      display:
                        files.findIndex((x) => x.name == image.name) ==
                          files.length - 1 && "none",
                    }}
                    onClick={() => {
                      let index = files.findIndex((x) => x.name == image.name);
                      if (index !== files.length - 1) {
                        setFiles((prev) => {
                          return SwapArray(prev, index, index + 1);
                        });
                      }
                    }}
                  ></IconButton>
                  <IconButton
                    children={<DeleteIcon />}
                    onClick={() => {
                      setFiles((prev) =>
                        prev.filter((i) => i.name !== image.name)
                      );
                    }}
                  ></IconButton>
                </Box>
                <img
                  src={URL.createObjectURL(image)}
                  style={{ width: "85%" }}
                  alt={image.name}
                />
                <center>
                  <Typography gutterBottom>
                    Последна промяна на{" "}
                    {moment(image.lastModified).locale("bg").format("LL")}
                  </Typography>
                </center>
                <center>
                  <Typography gutterBottom>
                    Размер {(image.size / 1e6).toFixed(2)} МБ
                  </Typography>
                </center>
              </Box>
            );
          })}
          <Typography variant="h5" style={{ textAlign: "center" }}>
            Преглед
          </Typography>
          <center>
            <Card
              inSearch={true}
              files={files}
              demo={true}
              key={Math.random()}
              idData={1}
              title={name}
              description={description}
              price={price}
              accessibility={accessibility}
              category={category}
              placelocation={location}
              dangerous={dangerous}
              likeButtonVisible={true}
              reportButtonVisible={true}
              liked={false}
              saved={false}
              numbersLiked={100}
              mainImg={false}
              images={[]}
              saveButtonVisible={true}
              adminRights={true}
            />
          </center>
          <center>
            <HCaptcha
              sitekey="f21dbfcd-0f79-42dd-ac97-2a7b6b63980a"
              size="normal"
              languageOverride="bg"
              onVerify={(token) => {
                setToken(token);
              }}
              onError={() => {
                toast.warn(
                  "Имаше грешка при потвърждаването, че не сте робот, пробвайте отново",
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
              }}
              onExpire={() => {
                toast.warn("Потвърдете отново, че не сте робот", {
                  position: "bottom-left",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              }}
            />
          </center>
          <center>
            <Button
              style={{ textTransform: "none" }}
              color="black"
              onClick={() => setOpenConditions(true)}
            >
              С качването на съдъражение се съгласявате с общите условия и
              политиката за поверителност
            </Button>
          </center>
          <center>
            <Button
              style={{ textTransform: "none", width: "50%" }}
              size="large"
              variant="outlined"
              type="submit"
              className="uploadBtn"
            >
              Качи
            </Button>
          </center>
        </form>
      </Container>
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
    </Box>
  );
};

export default Upload;
