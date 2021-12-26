import React from "react";
import Particles from "react-tsparticles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

import axios from "axios";
const userStats = (props) => {
  const [data, setData] = React.useState({});
  React.useLayoutEffect(() => {
    axios
      .get("http://localhost:5000/user/achievments/", {
        headers: { jwt: localStorage.getItem("jwt") },
      })
      .then((data) => {
        setData(data.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Box>
      <Particles
        id="tsparticles"
        options={{
          background: {
            color: {
              value: "#FFFFFF",
            },
          },
          fullScreen: {
            zIndex: -1,
          },
          particles: {
            bounce: {
              horizontal: {
                value: 0,
              },
              vertical: {
                value: 0,
              },
            },
            color: {
              value: ["#1E00FF", "#FF0061", "#E1FF00", "#00FF9E"],
              animation: {
                h: {
                  enable: true,
                  speed: 30,
                },
              },
            },
            move: {
              decay: 0.1,
              direction: "top",
              enable: true,
              gravity: {
                enable: true,
                maxSpeed: 200,
              },
              outModes: {
                default: "destroy",
                bottom: "bounce",
                left: "destroy",
                right: "destroy",
                top: "none",
              },
              speed: {
                min: 50,
                max: 150,
              },
            },
            number: {
              limit: 300,
              value: 0,
            },
            opacity: {
              animation: {
                speed: 0.3,
                sync: true,
                destroy: "min",
                startValue: "max",
              },
            },
            roll: {
              darken: {
                enable: true,
                value: 30,
              },
              enable: true,
              enlighten: {
                enable: true,
                value: 30,
              },
              speed: {
                min: 15,
                max: 25,
              },
            },
            rotate: {
              value: {
                min: 0,
                max: 360,
              },
              animation: {
                enable: true,
                speed: 60,
              },
              direction: "random",
            },
            shape: {
              options: {
                polygon: [
                  {
                    sides: 5,
                  },
                  {
                    sides: 6,
                  },
                ],
                character: [
                  {
                    value: ["💩", "🤡", "🍀", "🍙"],
                  },
                ],
              },
              type: [
                "circle",
                "square",
                "polygon",
                "character",
                "character",
                "character",
              ],
            },
            tilt: {
              value: {
                min: 0,
                max: 360,
              },
              animation: {
                enable: true,
                speed: 60,
              },
              direction: "random",
              enable: true,
            },
            wobble: {
              distance: 30,
              enable: true,
              speed: {
                min: -15,
                max: 15,
              },
            },
          },
          emitters: {
            autoPlay: true,
            fill: true,
            life: {
              wait: false,
            },
            rate: {
              quantity: 10,
              delay: 0.1,
            },
            shape: "square",
            startCount: 0,
            size: {
              mode: "percent",
              height: 0,
              width: 0,
            },
            position: {
              x: 50,
              y: 100,
            },
          },
        }}
      />
      <center>
        {" "}
        <Typography className="textInsight">
          Благодарим, че сте част от Неизвестно вече{" "}
          {data && moment().diff(data.date, "days")} дни. За това време сте
          качили {data && data.places_count} места, написали сте{" "}
          {data && data.comments_count} коментари и сте отговорили на{" "}
          {data.replies_count}!
        </Typography>
      </center>
    </Box>
  );
};
export default userStats;
