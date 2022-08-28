import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import Particles from "react-tsparticles";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ToggleIcon from "material-ui-toggle-icon";
import HCaptcha from "@hcaptcha/react-hcaptcha";
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
  const [passwordShow1, setShowPassword1] = React.useState(false);
  const [passwordShow2, setShowPassword2] = React.useState(false);
  const [token, setToken] = React.useState("");
  const submitPassword = (e) => {
    e.preventDefault();
    if (!token) {
      props.toast.warn("Не сте потвърдили, че не сте робот", {
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
        url: "https://unpopular-backend.herokuapp.com/user/password/reset",
        method: "PUT",
        data: { password: password, code: id },
        headers: { token: token },
      })
      .then(() => {
        props.toast("Паролата е променена", {
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
        url: "https://unpopular-backend.herokuapp.com/user/password/code",
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
  return (
    <Box>
      <Particles
        id="tsparticles"
        options={{
          background: {
            color: {
              value: "#fff",
            },
            position: "50% 50%",
            repeat: "no-repeat",
            size: "cover",
          },
          fullScreen: {
            zIndex: 1,
          },
          interactivity: {
            events: {
              onClick: {
                mode: "bubble",
              },
              onHover: {
                enable: true,
                mode: "slow",
                parallax: {
                  force: 60,
                },
              },
            },
            modes: {
              bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40,
              },
              grab: {
                distance: 400,
              },
            },
          },
          particles: {
            color: {
              value: "#000",
            },
            links: {
              color: {
                value: "#000",
              },
              distance: 150,
              enable: true,
              opacity: 0.4,
            },
            move: {
              attract: {
                rotate: {
                  x: 600,
                  y: 1200,
                },
              },
              enable: true,
              path: {},
              outModes: {
                bottom: "out",
                left: "out",
                right: "out",
                top: "out",
              },
              spin: {},
            },
            number: {
              value: 0,
            },
            opacity: {
              value: 0.5,
              animation: {
                speed: 1,
                minimumValue: 0.1,
              },
            },
            size: {
              random: {
                enable: true,
              },
              value: {
                min: 1,
                max: 5,
              },
              animation: {
                speed: 40,
                minimumValue: 0.1,
              },
            },
          },
          absorbers: {
            color: {
              value: "#000000",
            },
            draggable: false,
            opacity: 1,
            destroy: true,
            orbits: false,
            size: {
              random: {
                enable: true,
                minimumValue: 30,
              },
              value: {
                min: 30,
                max: 50,
              },
              density: 20,
              limit: {
                radius: 100,
                mass: 0,
              },
            },
            position: {
              x: 50,
              y: 50,
            },
          },
          emitters: [
            {
              autoPlay: true,
              fill: true,
              life: {
                wait: false,
              },
              rate: {
                quantity: 1,
                delay: 0.1,
              },
              shape: "square",
              startCount: 0,
              direction: "top-right",
              particles: {
                shape: {
                  type: "circle",
                },
                color: {
                  value: "random",
                },
                lineLinked: {
                  enable: false,
                },
                opacity: {
                  value: 0.3,
                },
                rotate: {
                  value: 0,
                  random: true,
                  direction: "counter-clockwise",
                  animation: {
                    enable: true,
                    speed: 15,
                    sync: false,
                  },
                },
                size: {
                  value: 10,
                  random: {
                    enable: true,
                    minimumValue: 5,
                  },
                },
                move: {
                  speed: 5,
                  random: false,
                  outMode: "bounce",
                },
              },
              position: {
                x: 0,
                y: 100,
              },
            },
          ],
        }}
      />
      {validity ? (
        <form className="resetPassword" onSubmit={submitPassword}>
          <Typography
            style={{ fontWeight: 800, textAlign: "center", fontSize: "2vmax" }}
          >
            Промяна на паролата
          </Typography>

          <Input
            style={{
              width: "100%",
              marginBottom: "2vmax",
              marginTop: "1vmax",
            }}
            onBlur={(e) => setPassword(e.target.value)}
            inputProps={{ maxLength: 100 }}
            id="standard-name"
            label="Нова парола"
            type={passwordShow2 ? "text" : "password"}
            className="inputField"
            margin="normal"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Покажи/скрий паролата"
                  onClick={() => setShowPassword2((state) => !state)}
                  edge="end"
                >
                  <ToggleIcon
                    on={passwordShow2}
                    onIcon={<Visibility />}
                    offIcon={<VisibilityOff />}
                  />
                </IconButton>
              </InputAdornment>
            }
            required
          />

          <br />

          <Input
            style={{
              width: "100%",
              marginBottom: "2vmax",
              marginTop: "1vmax",
            }}
            onBlur={(e) => setRepeatNewPassword(e.target.value)}
            inputProps={{ maxLength: 100 }}
            id="standard-name"
            label="Потвърди нова парола"
            type={passwordShow1 ? "text" : "password"}
            className="inputField"
            margin="normal"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Покажи/скрий паролата"
                  onClick={() => setShowPassword1((state) => !state)}
                  edge="end"
                >
                  <ToggleIcon
                    on={passwordShow1}
                    onIcon={<Visibility />}
                    offIcon={<VisibilityOff />}
                  />
                </IconButton>
              </InputAdornment>
            }
            required
          />
          <HCaptcha
            sitekey="f21dbfcd-0f79-42dd-ac97-2a7b6b63980a"
            size="normal"
            languageOverride="bg"
            onVerify={(token) => {
              setToken(token);
            }}
            onError={() => {
              props.toast.warn(
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
              props.toast.warn("Потвърдете отново, че не сте робот", {
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
      )}
    </Box>
  );
};
export default ResetPassword;
