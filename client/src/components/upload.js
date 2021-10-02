import React from "react";
import TextField from "@material-ui/core/TextField";
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

  const Upload = (e) => {
    e.preventDefault();
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
          headers: { jwt: localStorage.getItem("jwt") },
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
            toast.error("Не сте си потвърдили имейла!", {
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
    }
  };
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
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          placeholder="Име на мястото (Бар Кула)"
          required
        />
        <TextField
          onChange={(e) => setDescription(e.target.value)}
          className="UploadMain"
          variant="outlined"
          multiline
          rows={10}
          placeholder="Описание (Как изглежда мястото; как се стига до там; какво може да се види...)"
          required
        />
        <TextField
          onChange={(e) => setLocation(e.target.value)}
          className="UploadMain"
          variant="outlined"
          multiline
          rows={1}
          placeholder="Координати (52.0003,63.0005)"
        />
        <Divider style={{ flexShrink: "unset" }} />

        <TextField
          className="UploadMain"
          variant="outlined"
          inputProps={{ style: { fontSize: 15 } }}
          inputStyle={{ fontSize: "15px" }}
          margin="normal"
          helperText="Град/Район (Район Средец)"
          onChange={(e) => setCity(e.target.value)}
          placeholder="София"
          className="filter"
          required
        />
        <FormControl variant="outlined">
          <Select
            onChange={(e) => setCategory(e.target.value)}
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
            onChange={(e) => setPrice(e.target.value)}
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
            onChange={(e) => setDangerous(e.target.value)}
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
            onChange={(e) => setAccessibility(e.target.value)}
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
