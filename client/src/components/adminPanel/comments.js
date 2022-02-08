import React from "react";
import jwt_decode from "jwt-decode";
import Comment from "./../commentsModules/comment";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import { Typography } from "@material-ui/core";
const axios = require("axios");

const Comments = () => {
  const [data, setData] = React.useState([]);
  const [replies, setReplies] = React.useState([]);
  const isAdmin = () => {
    try {
      if (Boolean(jwt_decode(localStorage.getItem("jwt")).admin)) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  };
  React.useEffect(() => {
    if (!isAdmin) {
      toast.error("Не сте администратор", {
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
    getComments();
    getReplies();
  }, []);

  const getComments = () => {
    axios
      .get("https://unpopular-backend.herokuapp.com/admin/comments", {
        headers: { jwt: localStorage.getItem("jwt") },
        params: { limit: 9999 },
      })
      .then((data) => {
        setData(data.data);
      })
      .catch((err) => {
        toast.error("Грешка при получаването на информация", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };
  const getReplies = () => {
    axios
      .get("https://unpopular-backend.herokuapp.com/admin/replies", {
        headers: { jwt: localStorage.getItem("jwt") },
        params: { limit: 9999 },
      })
      .then((data) => {
        setReplies(data.data);
      })
      .catch((err) => {
        toast.error("Грешка при получаването на информация", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };
  const removeReply = (id) => {
    setReplies((prev) =>
      prev.filter((e) => Number(e.comments_id) !== Number(id))
    );
  };
  const removeComment = (id) => {
    setData((prev) => prev.filter((e) => Number(e.comments_id) !== Number(id)));
  };
  return (
    <center>
      <div className="panel-parent">
        <Box className="side">
          <Typography style={{ fontSize: "3.5vmax", margin: "1vmax" }}>
            Коментари
          </Typography>
          {data
            ? data.map((el) => (
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
              ))
            : "Няма данни"}
        </Box>
        <Box className="side">
          <Typography style={{ fontSize: "3.5vmax", margin: "1vmax" }}>
            Отговори
          </Typography>{" "}
          {replies
            ? replies.map((el) => (
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
              ))
            : "Няма данни"}
        </Box>
      </div>
    </center>
  );
};
export default Comments;
