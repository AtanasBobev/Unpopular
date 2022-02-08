import React from "react";
import { useParams } from "react-router-dom";
import Card from "./card";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Box";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";

const axios = require("axios");

const Place = (props) => {
  const [loading, setLoading] = React.useState(1);
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
    try {
      if (!Number(window.atob(id))) {
        setLoading(3);
        return false;
      }
      axios
        .get("https://unpopular-backend.herokuapp.com/place/specific", {
          params: { place_id: Number(window.atob(id)) },
        })
        .then((data) => {
          setLoading(3);
          setEl(data.data.length ? data.data[0] : []);
        });
    } catch (err) {
      setLoading(3);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <Box>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "87vh",
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {el[0] ? (
            <Card
              inSearch={true}
              toast={props.toast}
              key={Math.random()}
              idData={el[0].place_id}
              title={el[0].title}
              user_id={el[0].user_id}
              description={el[0].description}
              price={el[0].price}
              views={el[0].views}
              accessibility={el[0].accessibility}
              category={el[0].category}
              username={el[0].username}
              placelocation={el[0].placelocation}
              dangerous={el[0].dangerous}
              likeButtonVisible={verify()}
              reportButtonVisible={true}
              liked={el[0].liked == "true" ? true : false}
              saved={el[0].saved == "true" ? true : false}
              numbersLiked={Number(el[0].likednumber)}
              mainImg={el[0].url}
              date={el[0].date}
              images={el}
              saveButtonVisible={verify()}
              adminRights={el[0].user_id == ID()}
            />
          ) : (
            <Box
              style={{
                display: loading !== 3 && "none",
              }}
            >
              <center className="notFound">
                <Typography
                  style={{
                    fontSize:
                      window.innerWidth < window.innerHeight
                        ? "4vmax "
                        : "2vmax",
                    marginBottom:
                      window.innerWidth < window.innerHeight
                        ? "3vmax"
                        : "1vmax",
                  }}
                >
                  Мястото не е намерено
                </Typography>{" "}
              </center>
              <img
                style={{
                  width: "40vw",
                  pointerEvents: "none",
                  pointerEvents: "none",
                }}
                src={require("./../images/404Places.svg").default}
              />
              <center>
                <Typography style={{ marginTop: "3vmax" }} variant="h4">
                  Разгледайте други места като натиснеш бутона <b>Търси</b>
                </Typography>
              </center>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default Place;
