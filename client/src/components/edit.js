import React from "react";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import ImageIcon from "@material-ui/icons/Image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import isValidCoords from "is-valid-coords";
import Card from "./card";
import { useHistory } from "react-router-dom";
import isPointInBulgaria from "./isPointInBulgaria";
import { Map, Marker, ZoomControl } from "pigeon-maps";
import Image from "material-ui-image";
import HCaptcha from "@hcaptcha/react-hcaptcha";
const filter = require("leo-profanity");
filter.loadDictionary("en");
const axios = require("axios");

const Edit = (props) => {
  const history = useHistory();
  const [name, setName] = React.useState(props.name);
  const [description, setDescription] = React.useState(props.description);
  const [city, setCity] = React.useState(props.city);
  const [category, setCategory] = React.useState(props.category);
  const [price, setPrice] = React.useState(props.price);
  const [dangerous, setDangerous] = React.useState(props.dangerous);
  const [accessibility, setAccessibility] = React.useState(props.accessibility);
  const [files, setFiles] = React.useState({});
  const [location, setLocation] = React.useState(props.placelocation);
  const [token, setToken] = React.useState();

  const Upload = (e) => {
    e.preventDefault();
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
    if (!location || !isValidCoords(location.replace(/\s+/g, "").split(","))) {
      toast.error(
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
      if (filter.check(city)) {
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
      if (
        props.name == name &&
        props.dangerous == dangerous &&
        props.description == description &&
        props.city == city &&
        props.category == category &&
        props.price == price &&
        props.accessibility == accessibility &&
        props.placelocation == location &&
        !Object.keys(files).length
      ) {
        props.toast("Не сте направили промени", {
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
      const data = new FormData();
      data.append("name", name);
      data.append("description", description);
      data.append("city", city);
      data.append("category", category);
      data.append("price", price);
      data.append("accessibility", accessibility);
      data.append("dangerous", dangerous);
      data.append("location", location);
      data.append("place_id", props.item_id);
      data.append("newImages", Object.keys(files).length ? true : false);
      if (props.isOwner()) {
        Array.from(files).forEach((image) => {
          data.append("images", image);
        });
      }
      if (props.isOwner()) {
        axios
          .request({
            url: "http://localhost:5000/place",
            method: "PUT",
            data: data,
            headers: { jwt: localStorage.getItem("jwt"), token: token },
          })
          .then((res) => {
            props.close(false);
            props.toast.success(
              "Мястото е редактирано успешно. Презаредете страницата, за да видите промяната.",
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
            if (err.response.status == 403) {
              props.toast.warn(
                "Не сте създали това мяста, за да правите редакции",
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
            } else if (err.response.status == 400) {
              props.toast.error("Подадени са невалидни данни", {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            } else {
              props.toast.error("Неспецифична сървърна грешка", {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
          });
      } else {
        axios
          .request({
            url: "http://localhost:5000/place/suggest",
            method: "PUT",
            data: {
              name: name,
              description: description,
              city: city,
              price: price,
              category: category,
              price: price,
              accessibility: accessibility,
              dangerous: dangerous,
              location: location,
              place_id: props.item_id,
              user_id: props.user_id,
            },
            headers: { jwt: localStorage.getItem("jwt"), token: token },
          })
          .then((res) => {
            props.close(false);
            props.toast.success(
              "Промените са предложени успешно. Ако бъдат одобрени ще получите имейл.",
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
            props.toast.error(
              "Имаше проблем при изпращането на предложението! Пробвайте отново по-късно",
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
      }
    }
  };
  return (
    <Container maxWidth="sm">
      <center>
        <Typography>
          {!props.isOwner() &&
            "Предложете промяна на автора на мястото. Ако бъде одобрено, ще получите имейл."}
        </Typography>
      </center>
      <form
        onSubmit={(e) => {
          Upload(e);
        }}
        className="UploadForm"
      >
        <TextField
          onBlur={(e) => setName(e.target.value)}
          variant="outlined"
          placeholder="Име на мястото (Бар Кула)"
          defaultValue={props.name}
          inputProps={{ maxLength: 50 }}
          required
        />
        <TextField
          onBlur={(e) => setDescription(e.target.value)}
          className="UploadMain"
          defaultValue={props.description}
          variant="outlined"
          multiline
          rows={10}
          placeholder="Описание (Как изглежда мястото; как се стига до там; какво може да се види...)"
          inputProps={{ maxLength: 5000 }}
          required
        />
        <TextField
          onBlur={(e) => setLocation(e.target.value)}
          defaultValue={props.placelocation}
          className="UploadMain"
          variant="outlined"
          multiline
          rows={1}
          placeholder="Координати (52.0003,63.0005)"
          inputProps={{ maxLength: 100 }}
        />
        <Typography>
          Координатите трябва да е във формат "52.0003,63.0005". Отидете в
          Google Maps. Натиснете с десен бутон върху мястото, за което искате да
          копирате координатите. Натиснете с ляв бутон върху първата опция,
          която са координатите. Поставете ги в полето отгоре. Ако координатите
          са валидни, ще се появи карта и червен маркер на нея. Задължително
          координатите трябва да са в България.
        </Typography>
        <Box>
          <Divider style={{ flexShrink: "unset" }} />

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
                <Marker
                  width={50}
                  anchor={[
                    Number(location.replace(/\s+/g, "").split(",")[0]),
                    Number(location.replace(/\s+/g, "").split(",")[1]),
                  ]}
                  color="red"
                />
              </Map>
            )}
          <Divider style={{ flexShrink: "unset" }} />
        </Box>
        <TextField
          className="UploadMain"
          variant="outlined"
          inputProps={{ style: { fontSize: 15 } }}
          inputStyle={{ fontSize: "15px" }}
          margin="normal"
          helperText="Град/Район (Район Средец)"
          onBlur={(e) => setCity(e.target.value)}
          placeholder="София"
          className="filter"
          defaultValue={props.city}
          required
        />
        <FormControl variant="outlined">
          <Select
            onBlur={(e) => setCategory(e.target.value)}
            placeholder="Без значение"
            labelId="category-label"
            id="category"
            defaultValue={props.category}
            required
          >
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
            onBlur={(e) => setPrice(e.target.value)}
            labelId="price-label"
            id="price"
            defaultValue={props.price}
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
            defaultValue={props.dangerous}
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
            defaultValue={props.accessibility}
            required
          >
            <MenuItem value={2}>Достъп с инвалидни колички</MenuItem>
            <MenuItem value={3}>Леснодостъпно</MenuItem>
            <MenuItem value={4}>Средно трудно</MenuItem>
            <MenuItem value={5}>Труднодостъпно</MenuItem>
          </Select>
          <FormHelperText>Достъпност</FormHelperText>
        </FormControl>
        {props.isOwner() && (
          <>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              multiple
              type="file"
              onBlur={(e) => {
                if (e.target.files.length > 3) {
                  toast.error(
                    "Не е позволено качването на повече от 3 снимки с размер до 3 МБ",
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
                setFiles(e.target.files);
              }}
            />

            <label htmlFor="raised-button-file">
              <Button
                style={{ textTransform: "none" }}
                variant="outlined"
                component="span"
                startIcon={<ImageIcon />}
              >
                Качи снимки
              </Button>
            </label>
            {!Object.keys(files).length &&
              props.images.map((el) => (
                <div key={Math.random()}>
                  <Image
                    alt=""
                    style={{ width: "100%" }}
                    src={"http://localhost:5000/image/" + el.url}
                    aspectRatio={16 / 9}
                  />
                </div>
              ))}
            <ul>
              {Array.from(files).map((image) => {
                return (
                  <div>
                    <li>{image.name}</li>
                    <img
                      src={URL.createObjectURL(image)}
                      style={{ width: "30vw" }}
                      alt={image.name}
                    />
                  </div>
                );
              })}
            </ul>
          </>
        )}
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
        <HCaptcha
          sitekey="10000000-ffff-ffff-ffff-000000000001"
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
        <Button
          style={{ textTransform: "none" }}
          size="large"
          variant="contained"
          type="submit"
        >
          {props.isOwner() ? "Потвърди промяна" : "Предложи промяната"}
        </Button>
      </form>
    </Container>
  );
};

export default Edit;
