import React from "react";
import { useParams } from "react-router-dom";
import Card from "./card";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Box";
import jwt_decode from "jwt-decode";

const axios = require("axios");

const Place = (props) => {
  const { id } = useParams();
  const [el, setEl] = React.useState([]);
  const verify = () => {
    try {
      let a = jwt_decode(localStorage.getItem("jwt"));
      return a.Authorized ? true : false;
    } catch (err) {
      return false;
    }
  };
  const ID = () => {
    try {
      let a = jwt_decode(localStorage.getItem("jwt"));
      return a.user_id;
    } catch (err) {
      return false;
    }
  };
  const getData = () => {
    if (Number(id) == null || Number(id) == undefined) {
      return false;
    }
    axios
      .get("http://localhost:5000/place/specific", {
        params: { place_id: id },
      })
      .then((data) => {
        setEl(data.data[0]);
      })
      .catch((err) => {
        props.toast.error(
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
      });
  };

  React.useEffect(() => {
    getData();
  }, []);
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "87vh",
      }}
    >
      <Box>
        {el.length ? (
          <Card
            inSearch={true}
            toast={props.toast}
            key={Math.random()}
            idData={el[0].place_id}
            title={el[0].title}
            description={el[0].description}
            price={el[0].price}
            accessibility={el[0].accessibility}
            category={el[0].category}
            placelocation={el[0].placelocation}
            dangerous={el[0].dangerous}
            likeButtonVisible={verify()}
            reportButtonVisible={true}
            liked={el[0].liked == "true" ? true : false}
            saved={el[0].saved == "true" ? true : false}
            numbersLiked={Number(el[0].likednumber)}
            mainImg={el[0].url}
            images={el}
            saveButtonVisible={verify()}
            adminRights={el[0].user_id == ID()}
          />
        ) : (
          "Зареждане"
        )}
        <Typography style={{ marginTop: "3vmax" }} variant="h4">
          Разгледай подобни места като натиснеш бутона <b>Търси</b>
        </Typography>
      </Box>
    </Box>
  );
};
export default Place;
