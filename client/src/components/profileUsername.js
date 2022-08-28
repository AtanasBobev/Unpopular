import React from "react";
import axios from "axios";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import CardComponent from "./card";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Image from "material-ui-image";

import jwt_decode from "jwt-decode";

const ProfileUsername = () => {
  const { username } = useParams();
  const [data, setData] = React.useState([]);
  const [additional, setAdditional] = React.useState({});
  const [avatar, setAvatar] = React.useState("");
  const [admin, setAdmin] = React.useState(false);
  const [username1, setUsername] = React.useState("");
  const [loading, setLoading] = React.useState(1);

  React.useLayoutEffect(() => {
    axios
      .get("https://unpopular-backend.herokuapp.com/user/profile/", {
        params: { username: username },
      })
      .then((data) => setData(data.data))
      .catch((err) => {
        toast.error("Имаше грешка при запитването. Пробвайте отново по-късно", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    axios
      .get("https://unpopular-backend.herokuapp.com/user/profile/additional", {
        params: { username: username },
      })
      .then((data) => {
        setLoading(3);
        setAdditional(data.data[0]);
        if (data.data.length) {
          if (data.data[0].hasOwnProperty("avatar")) {
            setAvatar(data.data[0].avatar);
          }
          if (data.data[0].hasOwnProperty("username")) {
            setUsername(data.data[0].username);
          }
          setAdmin(Boolean(data.data[0].admin));
        }
      })
      .catch((err) => {});
  }, []);
  const ID = () => {
    try {
      let a = jwt_decode(localStorage.getItem("jwt"));
      return a.user_id;
    } catch (err) {
      return false;
    }
  };
  const verify = () => {
    try {
      let a = jwt_decode(localStorage.getItem("jwt"));
      return a.Authorized ? true : false;
    } catch (err) {
      return false;
    }
  };
  return (
    <Box>
      <center style={{ marginTop: "2vmax" }}>
        {avatar && (
          <>
            <img
              draggable="false"
              className="shadowy"
              style={{ borderRadius: "50%", width: "20vmax", height: "20vmax" }}
              src={"" + avatar}
              alt={"Имаше проблем при зареждането на аватара"}
            />
          </>
        )}

        <Typography className="shadowy2 mainTitle" variant="h3">
          {username1}
        </Typography>
        {username1 && loading == 3 ? (
          <>
            <Typography className="shadowy2" variant="h6">
              Присъединил се на{" "}
              {username1 && moment(additional.date).locale("bg").format("LL")}
            </Typography>
            {admin && (
              <Typography
                className="shadowy2"
                style={{ color: "#EEBC1D" }}
                variant="h7"
              >
                Администратор
              </Typography>
            )}
          </>
        ) : (
          <Box
            style={{
              position: "absolute",
              transform: "translate(-50%,-50%)",
              left: "50%",
              top: "50%",
              userSelect: "none",
              display: loading !== 3 && "none",
            }}
          >
            <Typography
              variant="h2"
              style={{
                fontSize: window.innerWidth < window.innerHeight && "7vmax",
              }}
            >
              Потребителят не е намерен
            </Typography>
            <img
              style={{
                width: window.innerWidth < window.innerHeight ? "70vw" : "40vw",
                pointerEvents: "none",
              }}
              src={require("./../images/404People.svg").default}
            />
          </Box>
        )}
      </center>
      <Box className="flexUser">
        {data &&
          data.map((el) => (
            <CardComponent
              inSearch={true}
              toast={toast}
              key={Math.random()}
              username={el[0].username}
              user_id={el[0].user_id}
              idData={el[0].place_id}
              title={el[0].title}
              description={el[0].description}
              price={el[0].price}
              accessibility={el[0].accessibility}
              category={el[0].category}
              dangerous={el[0].dangerous}
              placelocation={el[0].placelocation}
              likeButtonVisible={verify()}
              reportButtonVisible={true}
              liked={el[0].liked == "true" ? true : false}
              saved={el[0].saved == "true" ? true : false}
              numbersLiked={Number(el[0].score)}
              city={el[0].city}
              mainImg={el[0].url}
              images={el}
              saveButtonVisible={verify()}
              adminRights={el[0].user_id == ID()}
              user_id={el[0].user_id}
              avatar={el[0].avatar}
            />
          ))}
      </Box>
    </Box>
  );
};
export default ProfileUsername;
