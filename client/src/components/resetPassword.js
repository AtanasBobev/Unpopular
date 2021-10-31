import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useHistory, useParams } from "react-router-dom";
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
const ResetPassword = (props) => {
  const history = useHistory();
  const { id } = useParams();
  const [password, setPassword] = React.useState();
  const [validity, setValidity] = React.useState(true);
  const [repeatNewPassword, setRepeatNewPassword] = React.useState();
  const submitPassword = (e) => {
    e.preventDefault();
    if (password !== repeatNewPassword) {
      props.toast.warn("Паролите не съвпадат", {
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
    if (password.length > 100) {
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
    if (password.length < 8) {
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
    if (!schema.validate(password)) {
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
        url: "http://localhost:5000/user/password/reset",
        method: "PUT",
        data: { password: password, code: id },
      })
      .then(() => {
        props.toast("Паролата е променана успешно", {
          position: "bottom-left",
          autoClose: 15000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        history.push("/login");
      })
      .catch((e) => {
        if (e.response.status == 500) {
          props.toast.error("Имаше грешка при комункацията със сървъра", {
            position: "bottom-left",
            autoClose: 15000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (e.response.status == 401) {
          props.toast.error("Грешен или изтекъл код. Поискайте нов.", {
            position: "bottom-left",
            autoClose: 15000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (e.response.status == 400) {
          props.toast.error(
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
        }
      });
  };
  React.useEffect(() => {
    axios
      .request({
        url: "http://localhost:5000/user/password/code",
        method: "PUT",
        data: { code: id },
      })
      .catch((e) => {
        if (e.response.status == 500) {
          props.toast.error("Имаше проблем при комуникацията със сървъра", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (e.response.status == 401) {
          setValidity(false);
        }
      });
  }, []);
  return validity ? (
    <form className="resetPassword" onSubmit={submitPassword}>
      <Typography
        style={{ fontWeight: 800, textAlign: "center", fontSize: "2vmax" }}
      >
        Промяна на паролата
      </Typography>
      <TextField
        onChange={(e) => setPassword(e.target.value)}
        inputProps={{ maxLength: 100 }}
        id="standard-name"
        label="Нова парола"
        type="password"
        className="inputField"
        margin="normal"
        required
      />
      <br />
      <TextField
        onChange={(e) => setRepeatNewPassword(e.target.value)}
        inputProps={{ maxLength: 100 }}
        id="standard-name"
        label="Потвърди нова парола"
        type="password"
        className="inputField"
        margin="normal"
        required
      />
      <br />
      <Button
        type="submit"
        style={{ textTransform: "none", width: "auto" }}
        variant="contained"
        color="primary"
      >
        Промени
      </Button>
    </form>
  ) : (
    <Box className="resetPassword">
      <Typography
        style={{ fontWeight: 800, textAlign: "center", fontSize: "2vmax" }}
      >
        Грешен или изтекъл код
      </Typography>
      <Typography
        style={{
          fontWeight: 100,
          textAlign: "center",
          fontSize: "1.5vmax",
          marginTop: "0.5vmax",
        }}
      >
        Проверете отново имейла си или поискайте нов код
      </Typography>
    </Box>
  );
};
export default ResetPassword;
