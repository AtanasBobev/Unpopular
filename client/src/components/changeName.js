import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";

const filter = require("leo-profanity");
filter.loadDictionary("en");

const Name = (props) => {
  const [name, setName] = React.useState();

  const updateName = () => {
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
    if (/[а-яА-ЯЁё]/.test(name)) {
      props.toast("Не използвайте кирилица за потребителското име", {
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
    if (jwt_decode(localStorage.getItem("jwt")).Username == name) {
      props.toast(
        "Не може сегашното Ви потребителско име да е същото като предишното",
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
    if (name.length > 20) {
      props.toast("Името не може да е над 20 символа", {
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
      props.toast("Не може името да е под 5 символа", {
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
    axios
      .request({
        url: "https://unpopular-backend.herokuapp.com/user/name",
        method: "PUT",
        data: { name: name },
        headers: { jwt: localStorage.getItem("jwt") },
      })
      .then(() => {
        props.toast("Заявката е изпратена. Проверете си имейла", {
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
          props.toast.warn("Потребителското име вече е заето", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (err.response.status == 405) {
          props.toast.warn(
            "Имаме ограничена квота за имейли на ден. Моля изчакайте няколко минути преди да направите запитването!",
            {
              position: "bottom-left",
              autoClose: 15000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
        } else {
          props.toast.error("Сървърна грешка", {
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
  };
  return (
    <Box>
      <TextField
        inputProps={{ maxLength: 20 }}
        gutterBottom
        style={{ width: "100%", marginBottom: "2vmax", marginTop: "1vmax" }}
        placeholder="Ново име"
        onBlur={(e) => setName(e.target.value)}
      ></TextField>
      <center>
        <Button
          onClick={updateName}
          style={{ textTransform: "none" }}
          variant="outlined"
        >
          Промени
        </Button>
      </center>
    </Box>
  );
};
export default Name;
