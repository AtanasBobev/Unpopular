import React from "react";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tilty from "react-tilty";
import ForgottenPassword from "./forgottenPassword";
import PureModal from "react-pure-modal";
import { useHistory } from "react-router-dom";
import Particles from "react-tsparticles";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import ToggleIcon from "material-ui-toggle-icon";

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
  const [openPassword, setOpenPassword] = React.useState();
  const [token, setToken] = React.useState();
  const [passwordShow, setShowPassword] = React.useState(false);
  const register = (e) => {
    e.preventDefault();
    if (
      /\p{Extended_Pictographic}/u.test(username) ||
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
    if (/[а-яА-ЯЁё]/.test(username) || /[а-яА-ЯЁё]/.test(password)) {
      toast.warn(
        "Изглежда, че има символи, които са на кирилица в потребителското име или парола. Моля, придържайте се към латиница!",
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
    if (!token) {
      toast.warn("Не сте потвърдили, че не сте робот", {
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
      .post(
        "http://localhost:5000/register",
        {
          username: username,
          email: email,
          password: password,
        },
        { headers: { token: token } }
      )
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
      <Particles
        id="tsparticles"
        options={{
          autoPlay: true,
          background: {
            color: {
              value: "#FFFFFF",
            },
            image: "url('http://localhost:5000/image/nyan_cat.gif')",
            position: "-90% 50%",
            repeat: "no-repeat",
            size: "60%",
            opacity: 1,
          },
          backgroundMask: {
            composite: "destination-out",
            cover: {
              color: {
                value: "#fff",
              },
              opacity: 1,
            },
            enable: false,
          },
          fullScreen: {
            enable: true,
            zIndex: 0,
          },
          detectRetina: true,
          duration: 0,
          fpsLimit: 90,
          interactivity: {
            detectsOn: "window",
            events: {
              onClick: {
                enable: false,
                mode: "repulse",
              },
              onDiv: {
                selectors: [],
                enable: true,
                mode: [],
                type: "circle",
              },
              onHover: {
                enable: true,
                mode: "bubble",
                parallax: {
                  enable: false,
                  force: 2,
                  smooth: 10,
                },
              },
              resize: true,
            },
            modes: {
              attract: {
                distance: 200,
                duration: 0.4,
                easing: "ease-out-quad",
                factor: 1,
                maxSpeed: 50,
                speed: 1,
              },
              bounce: {
                distance: 200,
              },
              bubble: {
                distance: 150,
                duration: 2,
                mix: false,
                opacity: 8,
                size: 20,
              },
              connect: {
                distance: 80,
                links: {
                  opacity: 0.5,
                },
                radius: 60,
              },
              grab: {
                distance: 200,
                links: {
                  blink: false,
                  consent: false,
                  opacity: 1,
                },
              },
              light: {
                area: {
                  gradient: {
                    start: {
                      value: "#ffffff",
                    },
                    stop: {
                      value: "#000000",
                    },
                  },
                  radius: 1000,
                },
                shadow: {
                  color: {
                    value: "#000000",
                  },
                  length: 2000,
                },
              },
              push: {
                default: true,
                groups: [],
                quantity: 4,
              },
              remove: {
                quantity: 2,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
                factor: 100,
                speed: 1,
                maxSpeed: 50,
                easing: "ease-out-quad",
              },
              slow: {
                factor: 3,
                radius: 200,
              },
              trail: {
                delay: 1,
                pauseOnStop: false,
                quantity: 1,
              },
            },
          },
          manualParticles: [],
          motion: {
            disable: false,
            reduce: {
              factor: 4,
              value: true,
            },
          },
          particles: {
            bounce: {
              horizontal: {
                random: {
                  enable: false,
                  minimumValue: 0.1,
                },
                value: 1,
              },
              vertical: {
                random: {
                  enable: false,
                  minimumValue: 0.1,
                },
                value: 1,
              },
            },
            collisions: {
              bounce: {
                horizontal: {
                  random: {
                    enable: false,
                    minimumValue: 0.1,
                  },
                  value: 1,
                },
                vertical: {
                  random: {
                    enable: false,
                    minimumValue: 0.1,
                  },
                  value: 1,
                },
              },
              enable: false,
              mode: "bounce",
              overlap: {
                enable: true,
                retries: 0,
              },
            },
            color: {
              value: "#000000",
              animation: {
                h: {
                  count: 0,
                  enable: false,
                  offset: 0,
                  speed: 1,
                  sync: true,
                },
                s: {
                  count: 0,
                  enable: false,
                  offset: 0,
                  speed: 1,
                  sync: true,
                },
                l: {
                  count: 0,
                  enable: false,
                  offset: 0,
                  speed: 1,
                  sync: true,
                },
              },
            },
            destroy: {
              mode: "none",
              split: {
                count: 1,
                factor: {
                  random: {
                    enable: false,
                    minimumValue: 0,
                  },
                  value: 3,
                },
                rate: {
                  random: {
                    enable: false,
                    minimumValue: 0,
                  },
                  value: {
                    min: 4,
                    max: 9,
                  },
                },
                sizeOffset: true,
              },
            },
            gradient: [],
            groups: {},
            life: {
              count: 0,
              delay: {
                random: {
                  enable: false,
                  minimumValue: 0,
                },
                value: 0,
                sync: false,
              },
              duration: {
                random: {
                  enable: false,
                  minimumValue: 0.0001,
                },
                value: 0,
                sync: false,
              },
            },
            links: {
              blink: false,
              color: {
                value: "#ffffff",
              },
              consent: false,
              distance: 150,
              enable: false,
              frequency: 1,
              opacity: 0.4,
              shadow: {
                blur: 5,
                color: {
                  value: "#00ff00",
                },
                enable: false,
              },
              triangles: {
                enable: false,
                frequency: 1,
              },
              width: 1,
              warp: false,
            },
            move: {
              angle: {
                offset: 0,
                value: 90,
              },
              attract: {
                distance: 200,
                enable: false,
                rotate: {
                  x: 600,
                  y: 1200,
                },
              },
              decay: 0,
              distance: {},
              direction: "left",
              drift: 0,
              enable: true,
              gravity: {
                acceleration: 9.81,
                enable: false,
                inverse: false,
                maxSpeed: 50,
              },
              path: {
                clamp: true,
                delay: {
                  random: {
                    enable: false,
                    minimumValue: 0,
                  },
                  value: 0,
                },
                enable: false,
                options: {},
              },
              outModes: {
                default: "out",
                bottom: "out",
                left: "out",
                right: "out",
                top: "out",
              },
              random: false,
              size: false,
              speed: 6,
              spin: {
                acceleration: 0,
                enable: false,
              },
              straight: true,
              trail: {
                enable: false,
                length: 10,
                fillColor: {
                  value: "#000000",
                },
              },
              vibrate: false,
              warp: false,
            },
            number: {
              density: {
                enable: false,
                area: 800,
                factor: 1000,
              },
              limit: 0,
              value: 100,
            },
            opacity: {
              random: {
                enable: false,
                minimumValue: 0.1,
              },
              value: 0.5,
              animation: {
                count: 0,
                enable: false,
                speed: 1,
                sync: false,
                destroy: "none",
                startValue: "random",
                minimumValue: 0.1,
              },
            },
            orbit: {
              animation: {
                count: 0,
                enable: false,
                speed: 1,
                sync: false,
              },
              enable: false,
              opacity: 1,
              rotation: {
                random: {
                  enable: false,
                  minimumValue: 0,
                },
                value: 45,
              },
              width: 1,
            },
            reduceDuplicates: false,
            repulse: {
              random: {
                enable: false,
                minimumValue: 0,
              },
              value: 0,
              enabled: false,
              distance: 1,
              duration: 1,
              factor: 1,
              speed: 1,
            },
            roll: {
              darken: {
                enable: false,
                value: 0,
              },
              enable: false,
              enlighten: {
                enable: false,
                value: 0,
              },
              mode: "vertical",
              speed: 25,
            },
            rotate: {
              random: {
                enable: false,
                minimumValue: 0,
              },
              value: 0,
              animation: {
                enable: false,
                speed: 0,
                sync: false,
              },
              direction: "clockwise",
              path: false,
            },
            shadow: {
              blur: 0,
              color: {
                value: "#000000",
              },
              enable: false,
              offset: {
                x: 0,
                y: 0,
              },
            },
            shape: {
              options: {
                star: {
                  sides: 5,
                },
              },
              type: "star",
            },
            size: {
              random: {
                enable: true,
                minimumValue: 1,
              },
              value: {
                min: 1,
                max: 4,
              },
              animation: {
                count: 0,
                enable: false,
                speed: 40,
                sync: false,
                destroy: "none",
                startValue: "random",
                minimumValue: 0.1,
              },
            },
            stroke: {
              width: 0,
            },
            tilt: {
              random: {
                enable: false,
                minimumValue: 0,
              },
              value: 0,
              animation: {
                enable: false,
                speed: 0,
                sync: false,
              },
              direction: "clockwise",
              enable: false,
            },
            twinkle: {
              lines: {
                enable: false,
                frequency: 0.05,
                opacity: 1,
              },
              particles: {
                enable: false,
                frequency: 0.05,
                opacity: 1,
              },
            },
            wobble: {
              distance: 5,
              enable: false,
              speed: 50,
            },
            zIndex: {
              random: {
                enable: false,
                minimumValue: 0,
              },
              value: 0,
              opacityRate: 1,
              sizeRate: 1,
              velocityRate: 1,
            },
          },
          pauseOnBlur: true,
          pauseOnOutsideViewport: true,
          responsive: [],
          themes: [],
          zLayers: 100,
        }}
      />
      <Container className="centerInteractive">
        <div>
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
                  <FormControl
                    style={{ marginTop: "1.5vmax", marginBottom: "1vmax" }}
                    variant="standard"
                  >
                    <InputLabel htmlFor="standard-adornment-password">
                      Парола
                    </InputLabel>

                    <Input
                      onChange={(e) => setPassword(e.target.value)}
                      inputProps={{ maxLength: 100 }}
                      id="standard-name"
                      label="Парола"
                      type={passwordShow ? "text" : "password"}
                      className="inputField"
                      margin="normal"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Покажи/скрий паролата"
                            onClick={() => setShowPassword((state) => !state)}
                            edge="end"
                          >
                            <ToggleIcon
                              on={passwordShow}
                              onIcon={<Visibility />}
                              offIcon={<VisibilityOff />}
                            />
                          </IconButton>
                        </InputAdornment>
                      }
                      required
                    />
                  </FormControl>
                  <HCaptcha
                    sitekey="10000000-ffff-ffff-ffff-000000000001"
                    size="normal"
                    languageOverride="bg"
                    onVerify={(token) => {
                      setToken(token);
                    }}
                    onError={() => {
                      toast.warn(
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
                      toast.warn("Потвърдете отново, че не сте робот", {
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
                </Box>
                <Box className="buttonHolder">
                  <Button
                    type="submit"
                    style={{ textTransform: "none" }}
                    variant="contained"
                    color="primary"
                    className="loginBtn "
                  >
                    Потвърди
                  </Button>
                  <Box>
                    <Button
                      style={{ textTransform: "none" }}
                      variant="text"
                      color="primary"
                      onClick={() => {
                        setOpenPassword(true);
                      }}
                    >
                      Имам ли акаунт?
                    </Button>
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

export default Register;
