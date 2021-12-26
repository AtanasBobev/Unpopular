import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import jwt_decode from "jwt-decode";

const Email = (props) => {
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();

  const updateEmail = (e) => {
    e.preventDefault();
    if (jwt_decode(localStorage.getItem("jwt")).email == email) {
      props.toast("Не може имейлът да е същия като предишния", {
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
      /\p{Extended_Pictographic}/u.test(email) ||
      /\p{Extended_Pictographic}/u.test(password)
    ) {
      toast.warn("Не е позволено използването на емоджита", {
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
        url: "http://localhost:5000/user/email",
        method: "PUT",
        data: { email: email, password: password },
        headers: { jwt: localStorage.getItem("jwt") },
      })
      .then(() => {
        props.toast("Имейлът е променен", {
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
        if (err.response.status == 406) {
          props.toast.warn("Използването на временни имейли не е позволено", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (err.response.status == 409) {
          props.toast.warn("Имейлът вече същесвува в системата", {
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
            "Работим с ограничени ресурси, така че моля изчакайте няколко минути преди да пратите заявката си отново",
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
  };
  return (
    <Box>
      <form onSubmit={updateEmail}>
        <TextField
          inputProps={{ maxLength: 50 }}
          gutterBottom
          style={{ width: "100%", marginBottom: "2vmax", marginTop: "1vmax" }}
          placeholder="Нов имейл"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        ></TextField>
        <TextField
          inputProps={{ maxLength: 200 }}
          gutterBottom
          style={{ width: "100%", marginBottom: "2vmax", marginTop: "1vmax" }}
          placeholder="Парола"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        ></TextField>
        <center>
          <Button
            style={{ textTransform: "none" }}
            variant="outlined"
            type="submit"
          >
            Промени
          </Button>
        </center>
      </form>
    </Box>
  );
};
export default Email;
