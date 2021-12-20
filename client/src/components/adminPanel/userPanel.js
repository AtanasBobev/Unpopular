import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Comment from "./../commentsModules/comment";

import { toast } from "react-toastify";
import CardComponent from "./../card";

const axios = require("axios");
import moment from "moment";

const UserCard = (props) => {
  const [expanded, setExpanded] = React.useState(false);
  const [places, setUserPlaces] = React.useState([]);
  const [view, setView] = React.useState(1);
  const [comments, setComments] = React.useState(1);
  const [replies, setReplies] = React.useState(1);

  const removeComment = (id) => {
    setComments((prev) =>
      prev.filter((e) => Number(e.comments_id) !== Number(id))
    );
  };
  const removeReply = (id) => {
    setReplies((prev) =>
      prev.filter((e) => Number(e.comments_id) !== Number(id))
    );
  };
  React.useEffect(() => {
    axios
      .post(
        "http://localhost:5000/user/places",
        { limit: 999, admin: props.id },
        { headers: { jwt: localStorage.getItem("jwt") } }
      )
      .then((data) => {
        setUserPlaces(data.data);
      });

    axios
      .get("http://localhost:5000/user/comments", {
        params: { limit: 999, id: props.id },
        headers: { jwt: localStorage.getItem("jwt") },
      })
      .then((data) => {
        setComments(data.data);
      });
    axios
      .get("http://localhost:5000/user/replies", {
        params: { limit: 999, id: props.id },
        headers: { jwt: localStorage.getItem("jwt") },
      })
      .then((data) => {
        setReplies(data.data);
      });
  }, []);
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
  return (
    <Box>
      <Box className="infoBox">
        <Typography>{props.username}</Typography>
        <Typography>
          {moment(props.date).format("MMMM Do YYYY, hh:mm:ss")}
        </Typography>
        <Typography>{props.email}</Typography>
        <Box>
          <IconButton
            children={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setExpanded((prev) => !prev)}
          />
          <IconButton children={<DeleteIcon />} />
        </Box>
      </Box>
      {expanded && (
        <Box className="moreInfoBox">
          <Box className="boxes">
            <Box>Администратор: {props.admin == true ? "Да" : "Не"}</Box>
            <Box>Заключен: {props.locked == true ? "Да" : "Не"}</Box>
            <Box>Коментари: {Number(props.comment_count)}</Box>
            <Box>Отговори: {Number(props.replies_count)}</Box>
            <Box>
              Последен имейл:{" "}
              {moment(props.emailsent).format("MMMM Do YYYY, hh:mm:ss")}
            </Box>
            <Box>Качени места: {Number(props.upladed_places)}</Box>
            <Box>Харесани места: {Number(props.favoriteplaces_count)}</Box>
            <Box>Запазени места: {Number(props.savedplaces_count)}</Box>
            <Tooltip
              title={
                props.verified == "true"
                  ? "Няма линк, тъй като профилът е потвърден"
                  : props.verified
              }
            >
              <Box>Потвърден: {props.verified == "true" ? "Да" : "Не"}</Box>
            </Tooltip>
            <Box style={{ display: "flex", flexDirection: "column" }}>
              Аватар:
              <Box>
                {props.avatar ? (
                  <img
                    style={{ maxWidth: "5vw", width: "100%" }}
                    alt=""
                    src={"http://localhost:5000/image/" + props.avatar}
                  />
                ) : (
                  "Няма"
                )}
              </Box>
            </Box>
            <Box>ID: {Number(props.id)}</Box>
          </Box>
          {(places.length || comments.length || replies.length) && (
            <FormControl>
              <InputLabel>Места</InputLabel>
              <Select
                defaultValue={1}
                label="Покажи"
                onChange={(e) => setView(e.target.value)}
              >
                <MenuItem value={1}>Места</MenuItem>
                <MenuItem value={2}>Коментари</MenuItem>
                <MenuItem value={3}>Отговори</MenuItem>
              </Select>
            </FormControl>
          )}

          <Box
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
            }}
          >
            {places &&
              view == 1 &&
              places.map((el) => {
                return (
                  <CardComponent
                    inSearch={true}
                    toast={toast}
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
                    saved={el[0].saved == "true" ? true : false}
                    numbersLiked={Number(el[0].likednumber)}
                    city={el[0].city}
                    mainImg={el[0].url}
                    images={el}
                    saveButtonVisible={verify()}
                    adminRights={el[0].user_id == ID()}
                    username={el[0].username}
                    avatar={el[0].avatar}
                  />
                );
              })}
            {comments &&
              view == 2 &&
              comments.map((el) => (
                <Comment
                  noReply={true}
                  key={Math.random()}
                  getComments={() => {}}
                  idData={el.comments_id}
                  score={el.comment_score}
                  content={el.comment_content}
                  author={el.username}
                  user_id={el.user_id}
                  date={el.comment_date}
                  comments_actions={el.comments_actions}
                  avatar={el.avatar}
                  el={el}
                  toast={toast}
                  refreshData={removeComment}
                />
              ))}
            {replies &&
              view == 3 &&
              replies.map((el) => (
                <Comment
                  comment_id={el.relating}
                  SpecialReply={true}
                  noReply={true}
                  key={Math.random()}
                  getComments={() => {}}
                  idData={el.comments_id}
                  score={el.comment_score}
                  content={el.comment_content}
                  author={el.username}
                  user_id={el.user_id}
                  date={el.comment_date}
                  comments_actions={el.comments_actions}
                  avatar={el.avatar}
                  el={el}
                  toast={toast}
                  refreshData={removeReply}
                />
              ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UserCard;
