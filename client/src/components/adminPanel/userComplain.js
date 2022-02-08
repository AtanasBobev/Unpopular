import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PlaceIcon from "@mui/icons-material/Place";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import { toast } from "react-toastify";
import TooltipImage from "./../tooltipImage";
import Comment from "./../commentsModules/comment";
import PureModal from "react-pure-modal";
import ReplyIcon from "@mui/icons-material/Reply";
const axios = require("axios");

const UserComplains = (props) => {
  const [score, setScore] = React.useState(Number(props.priority));
  const [comment, showComment] = React.useState(false);
  const [reply, showReply] = React.useState(false);
  const [commentData, setCommentData] = React.useState([]);

  React.useEffect(() => {
    if (score < -1) {
      setScore(-1);
    }
    if (score == -1) {
      axios
        .request({
          url: "https://unpopular-backend.herokuapp.com/complain",
          method: "DELETE",
          data: { report_id: props.report_id },
          headers: { jwt: localStorage.getItem("jwt") },
        })
        .then(() => {
          props.deleteMe(props.report_id);
          toast("Докладът е изтрит", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .catch((err) => {
          setScore(0);
          toast.error("Имаше проблем при изтриването на доклада", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    } else {
      axios
        .request({
          url: "https://unpopular-backend.herokuapp.com/complain/score",
          method: "PUT",
          data: { report_id: props.report_id, priority: score },
          headers: { jwt: localStorage.getItem("jwt") },
        })
        .catch((err) => {
          toast.error("Имаше проблем при изпълнение на действието", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    }
  }, [score]);
  React.useEffect(() => {
    if (props.type == "comment" || props.type == "reply") {
      axios
        .request({
          method: "GET",
          url:
            "https://unpopular-backend.herokuapp.com/" +
            (props.type == "comment" ? "comment" : "replyData"),
          headers: {
            jwt: localStorage.getItem("jwt"),
          },
          params: {
            id: props.item_id,
          },
        })
        .then((data) => setCommentData(data.data));
    }
  }, []);
  return (
    <Box className="complainBox">
      <PureModal
        className="suggestions"
        header="Отговор"
        isOpen={reply}
        onClose={() => {
          showReply(false);
        }}
      >
        <Comment
          noReply={true}
          key={Math.random()}
          getComments={() => {}}
          idData={commentData.id}
          score={Number(commentData.score)}
          content={commentData.content}
          author={commentData.username}
          user_id={commentData.user_id}
          date={commentData.date}
          comments_actions={commentData.replies_actions}
          avatar={commentData.avatar}
          el={commentData}
          toast={toast}
          refreshData={() => {}}
        />
      </PureModal>
      <PureModal
        className="suggestions"
        header="Коментар"
        isOpen={comment}
        onClose={() => {
          showComment(false);
        }}
      >
        <Comment
          noReply={true}
          key={Math.random()}
          getComments={() => {}}
          idData={commentData.comments_id}
          score={Number(commentData.comment_score)}
          content={commentData.comment_content}
          author={commentData.username}
          user_id={commentData.user_id}
          date={commentData.date}
          comments_actions={commentData.comments_actions}
          avatar={commentData.avatar}
          el={commentData}
          toast={toast}
          refreshData={() => {}}
        />
      </PureModal>
      <Box className="firstRowComplain">
        <Typography> {props.date}</Typography>
        {props.type == "place" && (
          <Link
            underline="none"
            target="_blank"
            href={`https://unpopular-bulgaria.com/place/${window.btoa(
              props.item_id
            )}`}
          >
            Покажи
          </Link>
        )}
        {props.type == "comment" ? (
          <Button
            style={{ textTransform: "none" }}
            onClick={() => {
              showComment(true);
            }}
          >
            Покажи
          </Button>
        ) : (
          ""
        )}
        {props.type == "reply" ? (
          <Button
            style={{ textTransform: "none" }}
            onClick={() => {
              showReply(true);
            }}
          >
            Покажи
          </Button>
        ) : (
          ""
        )}
        <Typography>
          {props.type == "place" ? (
            <PlaceIcon />
          ) : props.type == "comment" ? (
            <ModeCommentIcon />
          ) : (
            <ReplyIcon />
          )}
        </Typography>
      </Box>
      <Typography style={{ padding: "1vmax" }}>{props.content}</Typography>
      <TooltipImage user_id={props.user_id} />
      <Box className="lastRowComplain">
        <IconButton
          onClick={() => {
            setScore((prev) => prev - 1);
          }}
          children={<RemoveIcon />}
        />
        <Typography style={{ padding: "1vmax" }} variant="h5">
          {score}
        </Typography>
        <IconButton
          onClick={() => {
            setScore((prev) => prev + 1);
          }}
          children={<AddIcon />}
        />
      </Box>
    </Box>
  );
};
export default UserComplains;
