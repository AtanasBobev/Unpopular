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
const Reply = (props) => {
  const [openReport, setReportOpen] = React.useState(false);
  const [score, setScore] = React.useState(Number(props.score));
  const [more, setMore] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(
    window.innerWidth < window.innerHeight
  );
  const deleteRelply = () => {
    axios
      .delete("https://unpopular-backend.herokuapp.com/reply/delete", {
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
        data: {
          reply_id: props.idData,
        },
      })
      .then(() => {
        props.refreshData();
        props.toast("Отговорът е изтрит", {
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
          props.toast.error("Нямате достъп до изтриване на този отговор", {
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
  const updateScore = (type) => {
    if (!props.replies_actions) {
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
    } else if (props.replies_actions == 1) {
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
    } else if (props.replies_actions == 2) {
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
    axios
      .post(
        "https://unpopular-backend.herokuapp.com/score/reply",
        {
          type: type,
          reply_id: props.idData,
          comment_id: props.parentId,
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
          props.toast.warn("Отговорът вече съществува", {
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
  return (
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
      className="reply"
    >
      <Box style={{ opacity: score < 0 && "0.4" }}>
        <Box className="commentUp">
          <Box className="vote">
            {verify() && (
              <IconButton
                style={{
                  color:
                    (Number(props.replies_actions) == 2 &&
                      score == Number(props.score)) ||
                    (score - 1 == Number(props.score) &&
                      !props.replies_actions) ||
                    (score - 2 == Number(props.score) &&
                      Number(props.replies_actions) == 1)
                      ? "gold"
                      : "grey",
                }}
                onClick={() => updateScore(2)}
                aria-label="Подкрепи"
              >
                <KeyboardArrowUpIcon />
              </IconButton>
            )}
            <Typography style={{ textAlign: "center", pointerEvents: "none" }}>
              {score}
            </Typography>
            {verify() && (
              <IconButton
                style={{
                  color:
                    (Number(props.replies_actions) == 1 &&
                      score == Number(props.score)) ||
                    (score + 1 == Number(props.score) &&
                      !props.replies_actions) ||
                    (score + 2 == Number(props.score) &&
                      Number(props.replies_actions) == 2)
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
        <center>
          {window.innerWidth < window.innerHeight && (
            <Button onClick={() => setMore((prev) => !prev)}>
              {more ? "-" : "+"}
            </Button>
          )}
        </center>
        {((more && isMobile) || !isMobile) && (
          <Box className="buttonArray">
            <Typography
              style={{
                alignSelf: "flex-start",
                flex: 1,
                marginTop: "1.3vmax",
                display: "flex",
                alignItems: "center",
                fontSize: "1.1vmax",
              }}
            >
              <TooltipImage author={props.author} avatar={props.avatar} /> |
              Дата: {moment(props.date).format("llll")}
            </Typography>
            {((verify() && ID() == props.user_id) || isAdmin()) && (
              <Button
                style={{ textTransform: "none" }}
                startIcon={<DeleteIcon />}
                onClick={() => {
                  confirmAlert({
                    title: "Потвърдете",
                    message:
                      "Сигурен ли сте, че искате да изтриете отговора? Това решение не може да се върне назад",
                    buttons: [
                      {
                        label: "Да",
                        onClick: () => deleteRelply(),
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
              <Button
                onClick={() => setReportOpen(!openReport)}
                style={{ textTransform: "none" }}
                startIcon={<ReportOutlinedIcon />}
              >
                Нередност
              </Button>
            )}
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
                type="reply"
              />
            </PureModal>
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default Reply;
