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
import TooltipImage from "./../tooltipImage";
import PureModal from "react-pure-modal";
import jwt_decode from "jwt-decode";
import Report from "./../report";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import AddReply from "./addReply";
import Reply from "./reply";
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
const Comment = (props) => {
  const [openReport, setReportOpen] = React.useState(false);
  const [score, setScore] = React.useState(Number(props.score));
  const [reply, setReply] = React.useState(false);
  React.useLayoutEffect(() => {
    setReply(false);
    setScore(Number(props.score));
  }, []);
  React.useLayoutEffect(() => {
    if (props.comments_actions == 1) {
      if (score < Number(props.score)) {
        setScore(Number(props.score));
      }
    } else if (props.comments_actions == 2) {
      if (score > Number(props.score)) {
        setScore(Number(props.score));
      }
    }
  }, [score]);
  const updateScore = (type) => {
    if (!props.comments_actions) {
      if (type == 1) {
        if (Number(score + 1) == Number(Number(props.score))) {
          setScore(score + 1);
        } else {
          setScore(score - 1);
        }
      } else {
        if (score - 1 == Number(Number(props.score))) {
          setScore(score - 1);
        } else {
          setScore(score + 1);
        }
      }
    } else if (props.comments_actions == 1) {
      if (type == 1 && score == Number(props.score)) {
        setScore(score + 1);
      } else if (type == 1) {
        setScore(score - 1);
      }
      if (type == 2 && score >= Number(props.score) + 2) {
        setScore(score - 1);
      } else if (type == 2) {
        setScore(score + 1);
      }
    } else if (props.comments_actions == 2) {
      if (type == 2 && score == Number(props.score)) {
        setScore(score - 1);
      } else if (type == 2) {
        setScore(score + 1);
      }
      if (type == 1 && score <= Number(props.score) - 2) {
        setScore(score + 1);
      } else if (type == 1) {
        setScore(score - 1);
      }
    }
    let link = props.SpecialReply
      ? "http://localhost:5000/score/reply"
      : "http://localhost:5000/score/comment";
    axios
      .post(
        link,
        {
          type: type,
          comment_id: props.idData,
          reply_id: props.idData,
        },
        {
          headers: {
            jwt: localStorage.getItem("jwt"),
          },
        }
      )
      .then(() => {})
      .catch((err) => {
        if (err.response.status == 400) {
          props.toast.error(
            "Рестартирайте приложението и влезнете отново в профила си",
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
        } else if (err.response.status == 409) {
          props.toast.error("Коментарът вече съществува", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          props.toast.error(
            "Неспецифично сървърна грешка. Пробвайте отново по-късно",
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
        }
      });
  };
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
  const deleteComment = () => {
    let link = props.SpecialReply
      ? "http://localhost:5000/reply/delete"
      : "http://localhost:5000/comment/delete";
    axios
      .delete(link, {
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
        data: {
          comment_id: props.idData,
        },
      })
      .then(() => {
        props.refreshData(props.idData);
        if (props.SpecialReply) {
          props.toast("Отговорът е изтрит", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          props.toast("Коментарът е изтрит", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((err) => {
        if (err.response.status == 400) {
          props.toast.error(
            "Рестартирайте приложението и влезнете отново в профила си",
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
        } else if (err.response.status == 403) {
          props.toast.error("Нямате достъп до изтриване на този коментар", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          props.toast.error(
            "Неспецифично сървърна грешка. Пробвайте отново по-късно",
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
        }
      });
  };
  return (
    <Box style={{ opacity: score < 0 && "0.4" }}>
      <Box
        style={{
          borderLeft: `5px solid ${
            Number(score) == 0
              ? "grey"
              : Number(score) >= 1 && Number(score) < 10
              ? "black"
              : Number(score) >= 10
              ? "gold"
              : "red"
          }`,
        }}
        className="comment"
      >
        <Box className="commentUp">
          <Box className="vote">
            {verify() && (
              <IconButton
                style={{
                  color:
                    (Number(props.comments_actions) == 2 &&
                      score == Number(props.score)) ||
                    (score - 1 == Number(props.score) &&
                      !props.comments_actions) ||
                    (score - 2 == Number(props.score) &&
                      Number(props.comments_actions) == 1)
                      ? "gold"
                      : "grey",
                }}
                onClick={() => updateScore(2)}
                aria-label="Подкрепи"
              >
                <KeyboardArrowUpIcon />
              </IconButton>
            )}
            <Typography style={{ textAlign: "center", userSelect: "none" }}>
              {score}
            </Typography>
            {verify() && (
              <IconButton
                style={{
                  color:
                    (Number(props.comments_actions) == 1 &&
                      score == Number(props.score)) ||
                    (score + 1 == Number(props.score) &&
                      !props.comments_actions) ||
                    (score + 2 == Number(props.score) &&
                      Number(props.comments_actions) == 2)
                      ? "gold"
                      : "grey",
                }}
                onClick={() => updateScore(1)}
                aria-label="Неподкрепи"
              >
                <KeyboardArrowDownIcon />
              </IconButton>
            )}
          </Box>
          <Typography style={{ marginLeft: "1vmax" }} variant="h6">
            {props.content}
          </Typography>
        </Box>
        <Box className="buttonArray">
          <Typography
            style={{
              alignSelf: "flex-start",
              flex: 1,
              marginTop: "1.3vmax",
              display: "flex",
              alignItems: "center",
            }}
          >
            {" "}
            <TooltipImage author={props.author} avatar={props.avatar} />| Дата:{" "}
            {moment(props.date).format("llll")}
            {" | "}
            {!props.noReply &&
              (props.el[0].reply_content == null
                ? "Няма отговори"
                : props.el[0].reply_content !== null && props.el.length == 1
                ? "1 отговор"
                : props.el[0].reply_content !== null && props.el.length == 2
                ? "2 отговора"
                : props.el.length + " отговори")}
          </Typography>

          {verify() && !props.noReply && (
            <Button
              onClick={() => setReply(!reply)}
              startIcon={<ReplyIcon />}
              style={{
                textTransform: "none",
                border: reply && "2px solid gold",
              }}
            >
              Отговори
            </Button>
          )}
          {((verify() && ID() == props.user_id) || isAdmin()) && (
            <Button
              style={{ textTransform: "none" }}
              startIcon={<DeleteIcon />}
              onClick={() => {
                confirmAlert({
                  title: "Потвърдете",
                  message:
                    "Сигурен ли сте, че искате да изтриете коментара? Това решение не може да се върне назад",
                  buttons: [
                    {
                      label: "Да",
                      onClick: () => deleteComment(),
                    },
                    {
                      label: "Не",
                    },
                  ],
                });
              }}
            >
              Изтрий
            </Button>
          )}
          {verify() && (
            <>
              <Button
                onClick={() => setReportOpen(!openReport)}
                style={{ textTransform: "none" }}
                startIcon={<ReportOutlinedIcon />}
              >
                Нередност
              </Button>
              <PureModal
                header="Съобщи за нередност"
                isOpen={openReport}
                onClose={() => {
                  setReportOpen(false);
                  return true;
                }}
              >
                <Report
                  toast={props.toast}
                  item_id={props.idData}
                  setReportOpen={setReportOpen}
                  type="comment"
                />
              </PureModal>
            </>
          )}
        </Box>
        {reply && (
          <AddReply
            refreshData={props.refreshData}
            toast={props.toast}
            relating={props.el[0].comments_id}
            setReply={setReply}
          />
        )}
        {!props.noReply &&
          props.el[0].reply_content !== null &&
          props.el.map((el) => (
            <Reply
              key={Math.random()}
              avatar={props.avatar}
              idData={el.replies_id}
              date={el.reply_date}
              author={el.username}
              user_id={el.user_id}
              score={el.reply_score}
              replies_actions={el.replies_actions}
              content={el.reply_content}
              toast={props.toast}
              parentId={props.el[0].comments_id}
              getComments={props.getComments}
              refreshData={props.refreshData}
            />
          ))}
      </Box>
    </Box>
  );
};

export default Comment;
