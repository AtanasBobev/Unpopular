import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
const passwordValidator = require("password-validator");

let schema = new passwordValidator();
schema
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .digits(2)
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf([
    "12345678",
    "123456789",
    "1234567890",
    "password",
    "qwerty123",
    "1234567890",
    "11111111",
    "iloveyou",
    "987654321",
    "superman",
    "iloveyou1",
    "Bulgaria",
    "bulgaria",
  ]);
const Password = (props) => {
  const [password, setPassword] = React.useState();
  const [newPassword, setNewPassword] = React.useState();
  const [newPassword2, setNewPassword2] = React.useState();

  const updateName = () => {
    if (newPassword2 !== newPassword) {
      props.toast.warning("Паролите не съвпадат", {
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
    if (newPassword.length > 100) {
      props.toast("Не може паролата да e над 100 символа", {
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
    if (newPassword.length < 8) {
      props.toast("Не може паролата да е под 8 символа", {
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
    if (!schema.validate(newPassword)) {
      props.toast.warn(
        "Паролата трябва да е поне 8 символа, да съдържа две цифри, малки и главни бувки и да не е често използвана като: 123456789 и подобни",
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
      return false;
    }
    axios
      .request({
        url: "http://localhost:5000/user/password",
        method: "PUT",
        data: { password: password, newPassword: newPassword },
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
          props.toast.error(
            "Може би сте актуализирали името си. Трябва да влезете отново",
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
          props.toast.error("Грешна парола", {
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
        inputProps={{ maxLength: 100 }}
        gutterBottom
        style={{ width: "100%", marginBottom: "2vmax", marginTop: "1vmax" }}
        placeholder="Нова парола"
        type="password"
        onChange={(e) => setNewPassword(e.target.value)}
      ></TextField>
      <TextField
        inputProps={{ maxLength: 100 }}
        gutterBottom
        type="password"
        style={{ width: "100%", marginBottom: "2vmax", marginTop: "1vmax" }}
        placeholder="Повторете новата парола"
        onChange={(e) => setNewPassword2(e.target.value)}
      ></TextField>
      <TextField
        inputProps={{ maxLength: 100 }}
        gutterBottom
        type="password"
        style={{ width: "100%", marginBottom: "2vmax", marginTop: "1vmax" }}
        placeholder="Текуща парола"
        onChange={(e) => setPassword(e.target.value)}
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
export default Password;
