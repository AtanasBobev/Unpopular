import React from "react";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tilty from "react-tilty";
import { useHistory } from "react-router-dom";
const passwordValidator = require("password-validator");
let schema = new passwordValidator();
const axios = require("axios");
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

const Register = (props) => {
  const history = useHistory();
  const [username, setUsername] = React.useState();
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();

  const register = (e) => {
    e.preventDefault();
    if (username.length > 20) {
      toast.warn("Не може потребителското име да е над 20 символа", {
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
    if (username.length < 5) {
      toast.warn("Не може потребителското име да е под 5 символа", {
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
    if (email.length > 50) {
      toast.warn("Не може имейлът да е над 50 символа", {
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
    if (email.length < 5) {
      toast.warn("Не може имейлът да е под 5 символа", {
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
      toast.warn(
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
      .post("http://localhost:5000/register", {
        username: username,
        email: email,
        password: password,
      })
      .then((e) => {
        localStorage.setItem("jwt", e.data.jwt);
        if (e.status == 200) {
          toast("Добре дошъл!", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          history.push("/verify");
        }
      })
      .catch((e) => {
        if (e.response.status == 409) {
          toast.warn(
            "Потребителското име или имейл вече съществуват в системата",
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
        } else if (e.response.status == 406) {
          toast.warn("Не е позволено използването на временни имейл адреси", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.warn("Неспецифична сървърна грешка", {
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
    <div>
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
      <Container className="centerInteractive">
        <div>
          <img
            src={require("../images/register.svg").default}
            className="loginRegisterImage"
          />
          <form
            onSubmit={(e) => {
              register(e);
            }}
          >
            <Tilty axis="X" gyroscope={false} perspective={4000}>
              <Box className="loginRegisterContainer">
                <Typography variant="h3" style={{ textAlign: "center" }}>
                  Регистрирай се
                </Typography>
                <Box className="inputFieldArea">
                  <TextField
                    onChange={(e) => setUsername(e.target.value)}
                    label="Потребителско име"
                    inputProps={{ maxLength: 20 }}
                    name="username"
                    className="inputField"
                    margin="normal"
                    required
                  />
                  <TextField
                    onChange={(e) => setEmail(e.target.value)}
                    label="Имейл"
                    inputProps={{ maxLength: 50 }}
                    className="inputField"
                    margin="normal"
                    name="email"
                    required
                  />
                  <TextField
                    onChange={(e) => setPassword(e.target.value)}
                    inputProps={{ maxLength: 100 }}
                    id="standard-name"
                    label="Парола"
                    type="password"
                    className="inputField"
                    margin="normal"
                    required
                  />
                </Box>
                <Box className="buttonHolder">
                  <Button
                    type="submit"
                    style={{ textTransform: "none" }}
                    variant="contained"
                    color="primary"
                  >
                    Потвърди
                  </Button>
                  <Box>
                    <Button
                      style={{ textTransform: "none" }}
                      variant="text"
                      color="primary"
                      onClick={() => {
                        history.push("/login");
                      }}
                    >
                      Влезни
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Tilty>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default Register;
