import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { useHistory, useParams } from "react-router-dom";
import Particles from "react-tsparticles";
import { useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";

import axios from "axios";
const Scrat = () => {
  const location = useLocation();
  const [code, setCode] = React.useState(undefined);

  React.useEffect(() => {
    axios
      .request(
        `https://unpopular-backend.herokuapp.com${
          location.pathname.split("scrat")[1]
        }`
      )
      .then((data) => {
        if (typeof data.data == "string") {
          if (
            data.data.includes("Неверен код") ||
            data.data.includes("Грешен код")
          ) {
            setCode(false);
          } else {
            setCode(true);
          }
        } else {
          setCode(true);
          if (data.data.jwt) {
            try {
              let a = jwt_decode(data.data.jwt);
              if (a) {
                localStorage.setItem("jwt", data.data.jwt);
                axios
                  .get("https://unpopular-backend.herokuapp.com/verified", {
                    headers: { jwt: localStorage.getItem("jwt") },
                  })
                  .then((data) => {
                    localStorage.setItem("jwt", data.data.jwt);
                  });
              }
            } catch (err) {
              console.error(err);
            }
          }
        }
      })
      .catch((err) => {
        setCode(false);
        console.error(err);
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
      <Box className="centerBox">
        <center>
          {code == undefined && (
            <Typography
              style={{ pointerEvents: "none", userSelect: "none" }}
              variant="h3"
            >
              Секундичка...
            </Typography>
          )}
          {code == false && (
            <Typography
              style={{ pointerEvents: "none", userSelect: "none" }}
              variant={window.innerWidth < window.innerHeight ? "h5" : "h3"}
            >
              Опс, май имате грешен или изтекъл код
            </Typography>
          )}
          {code == true && (
            <Typography
              style={{ pointerEvents: "none", userSelect: "none" }}
              variant="h3"
            >
              Готово!
            </Typography>
          )}
        </center>
      </Box>
    </Box>
  );
};
export default Scrat;
