import React from "react";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import ForgottenPassword from "./forgottenPassword";
import Tilty from "react-tilty";
import PureModal from "react-pure-modal";
const axios = require("axios");

const Login = (props) => {
  const history = useHistory();
  const [username, setUsername] = React.useState();
  const [openPassword, setOpenPassword] = React.useState();
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const [locked, setLocked] = React.useState(false);
  const [wrongPassword, setWrongPassword] = React.useState(false);

  const login = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/login", {
        username: username,
        password: password,
      })
      .then((e) => {
        localStorage.setItem("jwt", e.data.jwt);
        if (props.lsA()) {
          history.push("/search");
        } else {
          history.push("/verify");
        }
      })
      .catch((e) => {
        if (e.response.status == 500) {
          toast.error(
            "Имаше проблем със сървъра при запитването. Пробвайте отново по-късно!",
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
        } else if (e.response.status == 409) {
          toast.warn("Профил с тези данни не съществува!", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (e.response.status == 401) {
          setWrongPassword(true);
          setLocked(false);
          toast.warn("Грешна парола!", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (e.response.status == 425) {
          setLocked(true);
          toast.warn(
            "Вече Ви беше изпратен имейл с данни за отключване на профила. Изчакайте няколко минути преди да поискате нов!",
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
        } else if (e.response.status == 403) {
          setLocked(true);
          setWrongPassword(false);
          toast.warn(
            "Профилът е заключен, получили сте по имейл съобщение за отключването му. Проверете спам пощата Ви. Ако все пак не сте получили нищо, изкчакайте 10 минути и пробвайте да влезете отново, ще ви изпратим втори имейл.",
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
        console.log(e.response.status);
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
              login(e);
            }}
          >
            <Tilty axis="X" gyroscope={false} perspective={4000}>
              <Box className="loginRegisterContainer">
                <Typography variant="h3" style={{ textAlign: "center" }}>
                  Влизане
                </Typography>
                <Box className="inputFieldArea">
                  <TextField
                    onChange={(e) => setUsername(e.target.value)}
                    label="Потребителско име"
                    className="inputField"
                    margin="normal"
                    inputProps={{ maxLength: 100 }}
                    required
                  />
                  <TextField
                    onChange={(e) => setPassword(e.target.value)}
                    id="standard-name"
                    label="Парола"
                    type="password"
                    className="inputField"
                    margin="normal"
                    inputProps={{ maxLength: 100 }}
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
                    {locked ? "Нов имейл/Влезни" : "Влезни"}
                  </Button>
                  <Typography
                    style={{
                      color: "red",
                      margin: "1vmax",
                      fontSize: "0.9vmax",
                    }}
                  >
                    {wrongPassword && "Грешна парола"}
                    {locked &&
                      "Профилът е заключен поради прекалено много опити за влизане. Проверете си имейла!"}
                  </Typography>
                  <Box>
                    <Button
                      style={{ textTransform: "none" }}
                      variant="text"
                      color="primary"
                      onClick={() => {
                        setOpenPassword(true);
                      }}
                    >
                      Забравена парола
                    </Button>

                    <Button
                      style={{ textTransform: "none" }}
                      variant="text"
                      color="primary"
                      onClick={() => {
                        history.push("/register");
                      }}
                    >
                      Регистрирай се
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Tilty>
          </form>
          <PureModal
            header="Забравена парола"
            isOpen={openPassword}
            onClose={() => {
              setOpenPassword(!openPassword);
              return true;
            }}
          >
            <ForgottenPassword
              toast={toast}
              setOpenPassword={setOpenPassword}
            />
          </PureModal>
        </div>
      </Container>
    </div>
  );
};

export default Login;
