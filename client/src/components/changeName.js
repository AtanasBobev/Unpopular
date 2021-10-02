import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import jwt_decode from "jwt-decode";

const Name = (props) => {
  const [name, setName] = React.useState();
  const updateName = () => {
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
        url: "http://localhost:5000/user/name",
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
        if ((err.response.status = 409)) {
          props.toast.error("Потребителското име е вече заето", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
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
        onChange={(e) => setName(e.target.value)}
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
