import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import SendIcon from "@material-ui/icons/Send";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import ReportOutlinedIcon from "@material-ui/icons/ReportOutlined";
import ReplyIcon from "@material-ui/icons/Reply";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import TooltipImage from "./tooltipImage";
import PureModal from "react-pure-modal";
import jwt_decode from "jwt-decode";
import Report from "./report";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Reply from "./commentsModules/reply";
import AddComment from "./commentsModules/addComment";
import Comment from "./commentsModules/comment";
import AddReply from "./commentsModules/addReply";

const axios = require("axios");
const moment = require("moment");
moment.locale("bg");
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

const Comments = (props) => {
  let [data, setData] = React.useState(props.data);
  let [sortFunc, setSort] = React.useState(0);
  React.useEffect(() => {
    forceSort();
  }, [sortFunc, props.data]);
  React.useLayoutEffect(() => {
    setData(props.data);
  }, [props.data]);
  const verify = () => {
    try {
      let a = jwt_decode(localStorage.getItem("jwt"));
      return a.Authorized ? true : false;
    } catch (err) {
      return false;
    }
  };
  const forceSort = () => {
    if (data.length) {
      setData(
        [...data].forEach((el) => {
          if (el.length > 1) {
            el.sort((a, b) => {
              if (new Date(a.reply_date) > new Date(b.reply_date)) {
                return 1;
              } else if (new Date(b.reply_date) > new Date(a.reply_date)) {
                return -1;
              } else {
                return 0;
              }
            });
          }
        })
      );
      if (sortFunc == 1) {
        setData(
          [...data].sort((a, b) => {
            if (a[0].comment_score > b[0].comment_score) {
              return 1;
            } else if (b[0].comment_score > a[0].comment_score) {
              return -1;
            } else {
              return 0;
            }
          })
        );
      } else if (sortFunc == 2) {
        setData(
          [...data].sort((a, b) => {
            if (a[0].comment_score > b[0].comment_score) {
              return -1;
            } else if (b[0].comment_score > a[0].comment_score) {
              return 1;
            } else {
              return 0;
            }
          })
        );
      } else if (sortFunc == 3) {
        setData(
          [...data].sort((a, b) => {
            if (new Date(a[0].comment_date) > new Date(b[0].comment_date)) {
              return -1;
            } else if (
              new Date(b[0].comment_date) > new Date(a[0].comment_date)
            ) {
              return 1;
            } else {
              return 0;
            }
          })
        );
      } else {
        setData(
          [...data].sort((a, b) => {
            if (new Date(a[0].comment_date) > new Date(b[0].comment_date)) {
              return 1;
            } else if (
              new Date(b[0].comment_date) > new Date(a[0].comment_date)
            ) {
              return -1;
            } else {
              return 0;
            }
          })
        );
      }
    }
  };
  const refreshData = () => {
    axios
      .request("https://unpopular-backend.herokuapp.com/comments", {
        method: "GET",
        params: {
          place_id: props.idData,
        },
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
      })
      .then((data) => {
        setData(data.data);
      });
  };
  return (
    <Box>
      <AddComment
        data={data}
        setData={setData}
        toast={props.toast}
        place_id={props.place_id}
        setSort={setSort}
        refreshData={refreshData}
      />

      {data &&
        data.map((el) => (
          <Comment
            key={Math.random()}
            getComments={props.getComments}
            idData={el[0].comments_id}
            score={el[0].comment_score}
            content={el[0].comment_content}
            author={el[0].username}
            user_id={el[0].user_id}
            date={el[0].comment_date}
            comments_actions={el[0].comments_actions}
            avatar={el[0].avatar}
            el={el}
            toast={props.toast}
            refreshData={refreshData}
          />
        ))}
    </Box>
  );
};
export default Comments;
