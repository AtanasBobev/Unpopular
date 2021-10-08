import React from "react";
import FadeIn from "react-fade-in";
import Card from "./card";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ContentLoader from "react-content-loader";
import CachedIcon from "@material-ui/icons/Cached";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import jwt_decode from "jwt-decode";

const axios = require("axios");
const Liked = (props) => {
  const [likedLoading, setLikedLoading] = React.useState(1);
  const [likedQueryData, setLikedQueryData] = React.useState([]);
  const [likedQueryLimit, setLikedQueryLimit] = React.useState(10);
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
  const fetchLiked = () => {
    setLikedLoading(2);
    axios
      .get("http://localhost:5000/userLikedPlaces", {
        headers: { jwt: localStorage.getItem("jwt") },
        params: { limit: likedQueryLimit },
      })
      .then((data) => {
        setLikedQueryData(data.data);
        setLikedLoading(3);
      })
      .catch((err) => {
        setLikedLoading(1);
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
    fetchLiked();
  }, []);
  return (
    <Box>
      <center>
        <Typography style={{ margin: "2vmax" }} variant="h3">
          Харесани места
        </Typography>
        <Box className="oneLiner">
          <Typography gutterBottom variant="h5">
            {likedLoading == 3 && likedQueryData.length !== 0
              ? Number(likedQueryData[0][0]["count"]) == 1
                ? "1 резултат"
                : Number(likedQueryData[0][0]["count"]) == 2
                ? "2 резултата"
                : Number(likedQueryData[0][0]["count"]) + " резултати"
              : likedLoading !== 2 && "Няма резултати"}
          </Typography>
          {likedLoading !== 2 && (
            <IconButton onClick={() => fetchLiked()}>
              <CachedIcon />
            </IconButton>
          )}
        </Box>
      </center>
      <Box maxWidth="sm">
        {likedQueryData.length == 0 && likedLoading == 3 && (
          <img
            src={require("../images/liked.svg").default}
            className="noResultsBanner"
          />
        )}
        <FadeIn transitionDuration={600} delay={100} className="CardContainer">
          {likedLoading == 3 || likedLoading == 1 ? (
            likedQueryData.map((el) => {
              return (
                <Card
                  toast={props.toast}
                  key={Math.random()}
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
                  saved={true}
                  numbersLiked={Number(el[0].likednumber)}
                  mainImg={el[0].url}
                  images={el}
                  saveButtonVisible={verify()}
                  adminRights={el[0].user_id == ID()}
                  city={el[0].city}
                  username={el[0].username}
                  avatar={el[0].avatar}
                />
              );
            })
          ) : (
            <ContentLoader
              width={800}
              height={575}
              viewBox="0 0 800 575"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
              {...props}
            >
              <rect x="12" y="58" rx="2" ry="2" width="211" height="211" />
              <rect x="240" y="57" rx="2" ry="2" width="211" height="211" />
              <rect x="467" y="56" rx="2" ry="2" width="211" height="211" />
              <rect x="12" y="283" rx="2" ry="2" width="211" height="211" />
              <rect x="240" y="281" rx="2" ry="2" width="211" height="211" />
              <rect x="468" y="279" rx="2" ry="2" width="211" height="211" />
            </ContentLoader>
          )}
        </FadeIn>
        {likedLoading == 3 &&
          likedQueryData.length &&
          Number(likedQueryData[0][0]["count"]) !== 0 &&
          Number(likedQueryData[0][0]["count"]) > likedQueryLimit && (
            <Box
              style={{
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                marginTop: "2vmax",
              }}
            >
              <Button
                onClick={() => {
                  setLikedQueryLimit((prev) => prev + 10);
                }}
                startIcon={<AddIcon />}
              >
                Зареди още
              </Button>
            </Box>
          )}
      </Box>
    </Box>
  );
};

export default Liked;
