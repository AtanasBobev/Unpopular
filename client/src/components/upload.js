import React from "react";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import ImageIcon from "@material-ui/icons/Image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import isValidCoords from "is-valid-coords";
import Card from "./card";
import { useHistory } from "react-router-dom";
import isPointInBulgaria from "./isPointInBulgaria";
import { Map, Marker } from "pigeon-maps";
import HCaptcha from "@hcaptcha/react-hcaptcha";

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
  const [files, setFiles] = React.useState({});
  const [location, setLocation] = React.useState("");
  const [token, setToken] = React.useState();
  const Upload = (e) => {
    e.preventDefault();
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
      const data = new FormData();
      data.append("name", name);
      data.append("description", description);
      data.append("city", city);
      data.append("category", category);
      data.append("price", price);
      data.append("accessibility", accessibility);
      data.append("dangerous", dangerous);
      data.append("location", location);

      Array.from(files).forEach((image) => {
        data.append("images", image);
      });
      axios
        .post("http://localhost:5000/place", data, {
          headers: { jwt: localStorage.getItem("jwt"), token: token },
        })
        .then((res) => {
          history.push("/profile");
          toast.success("Мястото е качено успешно", {
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
  React.useEffect(() => {
    console.log([
      location.replace(/\s+/g, "").split(",")[0],
      location.replace(/\s+/g, "").split(",")[1],
    ]);
  }, [location]);
  return (
    <Container maxWidth="sm">
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
        <TextField
          onBlur={(e) => setName(e.target.value)}
          variant="outlined"
          placeholder="Име на мястото (Бар Кула)"
          inputProps={{ maxLength: 50 }}
          required
        />
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
            <MenuItem value={2}>Не е опасно</MenuItem>
            <MenuItem value={3}>Малко опасно</MenuItem>
            <MenuItem value={4}>Висока опасност</MenuItem>
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

        <input
          accept="image/*"
          style={{ display: "none" }}
          id="raised-button-file"
          multiple
          type="file"
          onChange={(e) => {
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
        <center>
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
        </center>
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
        <Typography variant="h5" style={{ textAlign: "center" }}>
          Преглед
        </Typography>
        <center>
          <Card
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
        <Button
          style={{ textTransform: "none" }}
          size="large"
          variant="contained"
          type="submit"
        >
          Качи
        </Button>
      </form>
    </Container>
  );
};

export default Upload;
