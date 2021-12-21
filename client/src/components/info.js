import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import moment from "moment";
import Particles from "react-tsparticles";
import Image from "material-ui-image";
import axios from "axios";
const Info = () => {
  let [places, setPlaces] = React.useState();
  let [users, setUsers] = React.useState();
  let [images, setImages] = React.useState();
  let [liked, setLiked] = React.useState();
  let [saved, setSaved] = React.useState();
  let [comments, setComments] = React.useState();
  let [replies, setReplies] = React.useState();
  React.useEffect(() => {
    axios.get("http://localhost:5000/stats").then((data) => {
      setPlaces(Number(data.data["places"]));
      setUsers(Number(data.data["users_count"]));
      setImages(Number(data.data["images"]));
      setLiked(Number(data.data["likes"]));
      setSaved(Number(data.data["saves"]));
      setComments(Number(data.data["comments"]));
      setReplies(Number(data.data["replies"]));
    });
  }, []);
  return (
    <div>
      {" "}
      <Particles
        style={{ zIndex: "0" }}
        options={{
          autoPlay: true,
          background: {
            color: { value: "transparent" },
            image: "",
            position: "50% 50%",
            repeat: "no-repeat",
            size: "cover",
            opacity: 1,
          },
          backgroundMask: {
            composite: "destination-out",
            cover: { color: { value: "#fff" }, opacity: 1 },
            enable: false,
          },
          fullScreen: { enable: true, zIndex: 1 },
          detectRetina: true,
          duration: 0,
          fpsLimit: 90,
          interactivity: {
            detectsOn: "window",
            events: {
              onClick: { enable: true, mode: "push" },
              onDiv: {
                selectors: "#repulse-div",
                enable: false,
                mode: "repulse",
                type: "circle",
              },
              onHover: {
                enable: true,
                mode: "bubble",
                parallax: { enable: true, force: 60, smooth: 10 },
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
              bounce: { distance: 200 },
              bubble: {
                distance: 100,
                duration: 1,
                mix: false,
                opacity: 0.8,
                size: 20,
              },
              connect: { distance: 200, links: { opacity: 0.5 }, radius: 60 },
              grab: {
                distance: 400,
                links: { blink: false, consent: false, opacity: 1 },
              },
              light: {
                area: {
                  gradient: {
                    start: { value: "#ffffff" },
                    stop: { value: "#000000" },
                  },
                  radius: 1000,
                },
                shadow: { color: { value: "#000000" }, length: 2000 },
              },
              push: { default: true, groups: [], quantity: 4 },
              remove: { quantity: 2 },
              repulse: {
                distance: 200,
                duration: 0.4,
                factor: 100,
                speed: 1,
                maxSpeed: 50,
                easing: "ease-out-quad",
              },
              slow: { factor: 3, radius: 200 },
              trail: { delay: 1, pauseOnStop: false, quantity: 1 },
            },
          },
          manualParticles: [],
          motion: { disable: false, reduce: { factor: 1, value: true } },
          particles: {
            bounce: {
              horizontal: {
                random: { enable: false, minimumValue: 0.1 },
                value: 1,
              },
              vertical: {
                random: { enable: false, minimumValue: 0.1 },
                value: 1,
              },
            },
            collisions: {
              bounce: {
                horizontal: {
                  random: { enable: false, minimumValue: 0.1 },
                  value: 1,
                },
                vertical: {
                  random: { enable: false, minimumValue: 0.1 },
                  value: 1,
                },
              },
              enable: false,
              mode: "bounce",
              overlap: { enable: true, retries: 0 },
            },
            color: {
              value: "random",
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
                  random: { enable: false, minimumValue: 0 },
                  value: 3,
                },
                rate: {
                  random: { enable: false, minimumValue: 0 },
                  value: { min: 4, max: 9 },
                },
                sizeOffset: true,
              },
            },
            gradient: [],
            groups: {},
            life: {
              count: 0,
              delay: {
                random: { enable: false, minimumValue: 0 },
                value: 0,
                sync: false,
              },
              duration: {
                random: { enable: false, minimumValue: 0.0001 },
                value: 0,
                sync: false,
              },
            },
            links: {
              blink: false,
              color: { value: "#ffffff" },
              consent: false,
              distance: 150,
              enable: false,
              frequency: 1,
              opacity: 0.4,
              shadow: { blur: 5, color: { value: "#00ff00" }, enable: false },
              triangles: { enable: false, frequency: 1 },
              width: 1,
              warp: false,
            },
            move: {
              angle: { offset: 0, value: 90 },
              attract: {
                distance: 200,
                enable: false,
                rotate: { x: 600, y: 1200 },
              },
              decay: 0,
              distance: {},
              direction: "none",
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
                  random: { enable: false, minimumValue: 0 },
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
              speed: 1,
              spin: { acceleration: 0, enable: false },
              straight: false,
              trail: {
                enable: false,
                length: 10,
                fillColor: { value: "#000000" },
              },
              vibrate: false,
              warp: false,
            },
            number: {
              density: { enable: true, area: 800, factor: 1000 },
              limit: 500,
              value: 300,
            },
            opacity: {
              random: { enable: false, minimumValue: 0.1 },
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
              animation: { count: 0, enable: false, speed: 1, sync: false },
              enable: false,
              opacity: 1,
              rotation: {
                random: { enable: false, minimumValue: 0 },
                value: 45,
              },
              width: 1,
            },
            reduceDuplicates: false,
            repulse: {
              random: { enable: false, minimumValue: 0 },
              value: 0,
              enabled: false,
              distance: 1,
              duration: 1,
              factor: 1,
              speed: 1,
            },
            roll: {
              darken: { enable: false, value: 0 },
              enable: false,
              enlighten: { enable: false, value: 0 },
              mode: "vertical",
              speed: 25,
            },
            rotate: {
              random: { enable: false, minimumValue: 0 },
              value: 0,
              animation: { enable: false, speed: 0, sync: false },
              direction: "clockwise",
              path: false,
            },
            shadow: {
              blur: 0,
              color: { value: "#000000" },
              enable: false,
              offset: { x: 0, y: 0 },
            },
            shape: { options: {}, type: "circle" },
            size: {
              random: { enable: true, minimumValue: 1 },
              value: { min: 1, max: 5 },
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
            stroke: { width: 0 },
            tilt: {
              random: { enable: false, minimumValue: 0 },
              value: 0,
              animation: { enable: false, speed: 0, sync: false },
              direction: "clockwise",
              enable: false,
            },
            twinkle: {
              lines: { enable: false, frequency: 0.05, opacity: 1 },
              particles: { enable: false, frequency: 0.05, opacity: 1 },
            },
            wobble: { distance: 5, enable: false, speed: 50 },
            zIndex: {
              random: { enable: false, minimumValue: 0 },
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
      <div className="backgroundInfo">
        <Box className="info">
          <center>
            <img className="meImg" src={require("../images/me.jpg").default} />
          </center>
          <Typography gutterBottom variant="h5">
            Здравей, името ми е Атанас на {moment().diff("2004-04", "years")}
            години от София. Занимавам се от няколко години с програмиране и за
            мен това е начин за свързване на хората по-близо. Вярвам, че всеки
            трябва да има достъп до платформа където да разказва своята история
            чрез местата, които е посетил. Идеята за проекта дойде миналото
            лято, след като бях на гости и не познавах града достатъчно добре,
            за да знам някои интересни и нетолкова комерсиализирани места.{" "}
            <b
              onClick={() =>
                window
                  .open("https://github.com/AtanasBobev/Unpopular", "_blank")
                  .focus()
              }
              style={{ color: "gold", cursor: "pointer" }}
            >
              Неизвестно
            </b>{" "}
            се оформи като платформа за споделяне на интересни места в различни
            градове, предлагайки на всеки достъп до единна база данни с места,
            без ограничения - от всеки, за всеки.
          </Typography>
          {places && (
            <Typography gutterBottom variant="h6">
              <center>
                <b>Няколко бързи факта за платформата:</b>
              </center>
              <ul>
                {places && <li>Качени са {places} места</li>}
                {users && <li>Регистрирани са {users} потребители</li>}
                {images && <li>Качени са {images} изображения</li>}
                {liked && <li>Харесани са {liked} места</li>}
                {saved && <li>Запазени са {saved} места</li>}
                {comments && <li>Публикувани са {comments} коментара</li>}
                {replies && <li>На тези коментари има {replies} отговора</li>}
              </ul>
            </Typography>
          )}
          <center>
            <Typography gutterBottom variant="h5">
              <b>Помогни на проекта! </b>
            </Typography>
          </center>
          <Typography gutterBottom variant="h6">
            Изчислителната мощ и пространството за съхранение струват пари.
            Помогни на проекта да просъществува с дарение на IBAN: 1231257126357
          </Typography>
          <center>
            {" "}
            <i>
              <div>
                Icons made by{" "}
                <a href="https://www.freepik.com" title="Freepik">
                  Freepik
                </a>{" "}
                from{" "}
                <a href="https://www.flaticon.com/" title="Flaticon">
                  www.flaticon.com
                </a>
              </div>
            </i>{" "}
          </center>
        </Box>
      </div>
    </div>
  );
};
export default Info;
