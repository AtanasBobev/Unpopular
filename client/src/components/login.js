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
import Particles from "react-tsparticles";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import amongus from "../images/cyan_amongus.png";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ToggleIcon from "material-ui-toggle-icon";

const axios = require("axios");

const Login = (props) => {
  const [passwordShow, setShowPassword] = React.useState(false);

  const history = useHistory();
  const [username, setUsername] = React.useState();
  const [openPassword, setOpenPassword] = React.useState();
  const [password, setPassword] = React.useState();
  const [locked, setLocked] = React.useState(false);
  const [wrongPassword, setWrongPassword] = React.useState(false);
  const [token, setToken] = React.useState();
  const login = (e) => {
    e.preventDefault();
    if (
      /\p{Extended_Pictographic}/u.test(username) ||
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
    axios
      .post(
        "http://localhost:5000/login",
        {
          credentials: "include",
          username: username,
          password: password,
        },
        { headers: { token: token } }
      )
      .then((e) => {
        localStorage.setItem("jwt", e.data.jwt);
        if (props.lsA()) {
          history.push("/search");
        } else {
          history.push("/verify");
        }
      })
      .catch((err) => {
        if (err.response.status == 500) {
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
        } else if (err.response.status == 409) {
          toast.warn("Профил с тези данни не съществува!", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (err.response.status == 401) {
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
        } else if (rre.response.status == 425) {
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
        } else if (err.response.status == 403) {
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
      });
  };
  return (
    <div>
      <Particles
        id="tsparticles"
        options={{
          autoPlay: true,
          background: {
            color: {
              value: "#ffffff",
            },
            image: "",
            position: "50% 50%",
            repeat: "no-repeat",
            size: "cover",
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
                mode: ["attract"],
              },
              onDiv: {
                selectors: [],
                enable: false,
                mode: [],
                type: "circle",
              },
              onHover: {
                enable: true,
                mode: ["attract"],
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
                maxSpeed: 20,
                speed: 1,
              },
              bounce: {
                distance: 200,
              },
              bubble: {
                distance: 200,
                duration: 0.4,
                mix: false,
              },
              connect: {
                distance: 80,
                links: {
                  opacity: 0.5,
                },
                radius: 60,
              },
              grab: {
                distance: 100,
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
                      value: "#ffffff",
                    },
                  },
                  radius: 1000,
                },
                shadow: {
                  color: {
                    value: "#ffffff",
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
                particles: {
                  color: {
                    value: "#000000",
                    animation: {
                      enable: true,
                      speed: 400,
                      sync: true,
                    },
                  },
                  collisions: {
                    enable: false,
                  },
                  links: {
                    enable: false,
                  },
                  move: {
                    outModes: {
                      default: "destroy",
                    },
                    speed: 2,
                  },
                  size: {
                    value: 5,
                    animation: {
                      enable: true,
                      speed: 5,
                      minimumValue: 1,
                      sync: true,
                      startValue: "min",
                      destroy: "max",
                    },
                  },
                },
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
                  speed: 20,
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
            groups: {
              z5000: {
                number: {
                  value: 70,
                },
                zIndex: {
                  value: 50,
                },
              },
              z7500: {
                number: {
                  value: 30,
                },
                zIndex: {
                  value: 75,
                },
              },
              z2500: {
                number: {
                  value: 50,
                },
                zIndex: {
                  value: 25,
                },
              },
              z1000: {
                number: {
                  value: 40,
                },
                zIndex: {
                  value: 10,
                },
              },
            },
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
              distance: 100,
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
                value: 10,
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
              direction: "right",
              drift: 0,
              enable: true,
              gravity: {
                acceleration: 9.81,
                enable: false,
                inverse: false,
                maxSpeed: 10,
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
              speed: 5,
              spin: {
                acceleration: 0,
                enable: false,
              },
              straight: false,
              trail: {
                enable: false,
                length: 10,
                fillColor: {
                  value: "#FFFFFF",
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
              value: 200,
            },
            opacity: {
              random: {
                enable: false,
                minimumValue: 0.1,
              },
              value: 1,
              animation: {
                count: 0,
                enable: false,
                speed: 3,
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
                value: "#FFFFFF",
              },
              enable: false,
              offset: {
                x: 0,
                y: 0,
              },
            },
            shape: {
              options: {},
              type: "circle",
            },
            size: {
              random: {
                enable: false,
                minimumValue: 1,
              },
              value: 3,
              animation: {
                count: 0,
                enable: false,
                speed: 5,
                sync: false,
                destroy: "none",
                startValue: "random",
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
              value: 5,
              opacityRate: 0.5,
              sizeRate: 1,
              velocityRate: 1,
            },
          },
          pauseOnBlur: true,
          pauseOnOutsideViewport: true,
          responsive: [],
          themes: [],
          zLayers: 100,
          emitters: {
            autoPlay: true,
            fill: true,
            life: {
              wait: false,
            },
            rate: {
              quantity: 1,
              delay: 7,
            },
            shape: "square",
            startCount: 0,
            size: {
              mode: "percent",
              height: 0,
              width: 0,
            },
            particles: {
              shape: {
                type: "images",
                options: {
                  images: {
                    src: amongus,
                    width: 500,
                    height: 634,
                  },
                },
              },
              size: {
                value: 40,
              },
              move: {
                speed: 10,
                outModes: {
                  default: "none",
                  right: "destroy",
                },
                straight: true,
              },
              zIndex: {
                value: 0,
              },
              rotate: {
                value: {
                  min: 0,
                  max: 360,
                },
                animation: {
                  enable: true,
                  speed: 10,
                  sync: true,
                },
              },
            },
            position: {
              x: -5,
              y: 55,
            },
          },
        }}
      />
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
                    label="Потребителско име/Имейл"
                    className="inputField"
                    margin="normal"
                    inputProps={{ maxLength: 100 }}
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
                </Box>
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
                <Box className="buttonHolder">
                  <Button
                    type="submit"
                    style={{ textTransform: "none" }}
                    variant="contained"
                    color="primary"
                    className="loginBtn"
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
