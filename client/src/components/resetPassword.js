import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import Particles from "react-tsparticles";
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
          fpsLimit: 90,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onDiv: {
                selectors: "#repulse-div",
                mode: "repulse",
              },
              onHover: {
                mode: "connect",
                parallax: {
                  enable: true,
                  force: 70,
                },
              },
            },
            modes: {
              attract: {
                maxSpeed: 20,
              },
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
              value: "#ffffff",
            },
            links: {
              color: {
                value: "#000",
              },
              distance: 150,
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
              density: {
                enable: true,
              },
              value: 80,
            },
            opacity: {
              random: {
                enable: true,
              },
              value: {
                min: 0.1,
                max: 1,
              },
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.2,
              },
            },
            rotate: {
              random: {
                enable: true,
              },
              animation: {
                enable: true,
                speed: 5,
              },
              direction: "random",
            },
            shape: {
              options: {
                character: {
                  fill: false,
                  font: "Verdana",
                  style: "",
                  value: "*",
                  weight: "400",
                },
                char: {
                  fill: false,
                  font: "Verdana",
                  style: "",
                  value: "*",
                  weight: "400",
                },
                polygon: {
                  sides: 5,
                },
                star: {
                  sides: 5,
                },
                image: [
                  {
                    src: "https://particles.js.org/images/fruits//apple.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//avocado.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//banana.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//berries.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//cherry.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//grapes.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//lemon.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//orange.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//peach.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//pear.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//pepper.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//plum.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//star.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//strawberry.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//watermelon.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//watermelon_slice.png",
                    width: 32,
                    height: 32,
                  },
                ],
                images: [
                  {
                    src: "https://particles.js.org/images/fruits//apple.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//avocado.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//banana.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//berries.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//cherry.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//grapes.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//lemon.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//orange.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//peach.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//pear.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//pepper.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//plum.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//star.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//strawberry.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//watermelon.png",
                    width: 32,
                    height: 32,
                  },
                  {
                    src: "https://particles.js.org/images/fruits//watermelon_slice.png",
                    width: 32,
                    height: 32,
                  },
                ],
              },
              type: "image",
            },
            size: {
              value: 16,
              animation: {
                speed: 40,
                minimumValue: 0.1,
              },
            },
            stroke: {
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
            },
          },
        }}
      />
      {validity ? (
        <form className="resetPassword" onSubmit={submitPassword}>
          <Typography
            style={{ fontWeight: 800, textAlign: "center", fontSize: "2vmax" }}
          >
            Промяна на паролата
          </Typography>
          <TextField
            onBlur={(e) => setPassword(e.target.value)}
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
            onBlur={(e) => setRepeatNewPassword(e.target.value)}
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
      )}
    </Box>
  );
};
export default ResetPassword;
