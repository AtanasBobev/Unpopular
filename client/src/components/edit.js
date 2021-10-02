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

      Array.from(files).forEach((image) => {
        data.append("images", image);
      });
      axios
        .request({
          url: "http://localhost:5000/place",
          method: "PUT",
          data: data,
          headers: { jwt: localStorage.getItem("jwt") },
        })
        .then((res) => {
          props.close(false);
          props.toast.success("Мястото е редактирано успешно", {
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
          if (err.response.status == 403) {
            props.toast.error(
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
    }
  };
  return (
    <Container maxWidth="sm">
      <form
        onSubmit={(e) => {
          Upload(e);
        }}
        className="UploadForm"
      >
        <TextField
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          placeholder="Име на мястото (Бар Кула)"
          defaultValue={props.name}
          required
        />
        <TextField
          onChange={(e) => setDescription(e.target.value)}
          className="UploadMain"
          defaultValue={props.description}
          variant="outlined"
          multiline
          rows={10}
          placeholder="Описание (Как изглежда мястото; как се стига до там; какво може да се види...)"
          required
        />
        <TextField
          onChange={(e) => setLocation(e.target.value)}
          defaultValue={props.placelocation}
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
          defaultValue={props.city}
          required
        />
        <FormControl variant="outlined">
          <Select
            onChange={(e) => setCategory(e.target.value)}
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
            onChange={(e) => setPrice(e.target.value)}
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
            onChange={(e) => setDangerous(e.target.value)}
            labelId="dangerous-label"
            defaultValue={props.dangerous}
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
        {!Object.keys(files).length &&
          props.images.map((el) => (
            <div key={Math.random()}>
              <img
                alt=""
                style={{ width: "100%" }}
                src={"http://localhost:5000/image/" + el.url}
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
          Потвърди промяна
        </Button>
      </form>
    </Container>
  );
};

export default Edit;
