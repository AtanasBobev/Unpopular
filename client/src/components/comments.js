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

const axios = require("axios");
const moment = require("moment");
moment.locale("bg");
const Reply = (props) => {
  const [openReport, setReportOpen] = React.useState(false);

  const [score, setScore] = React.useState(Number(props.score));
  const deleteRelply = () => {
    axios
      .delete("http://localhost:5000/reply/delete", {
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
        data: {
          reply_id: props.idData,
        },
      })
      .then(() => {
        props.getComments();
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
        "http://localhost:5000/score/reply",
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
      .then(() => {
        props.getComments();
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
            <Typography style={{ textAlign: "center", userSelect: "none" }}>
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
            <TooltipImage author={props.author} avatar={props.avatar} /> | Дата:{" "}
            {moment(props.date).format("llll")}
          </Typography>
          {verify() && ID() == props.user_id && (
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
      </Box>
    </Box>
  );
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
    axios
      .post(
        "http://localhost:5000/score/comment",
        {
          type: type,
          comment_id: props.idData,
        },
        {
          headers: {
            jwt: localStorage.getItem("jwt"),
          },
        }
      )
      .then(() => {
        props.getComments();
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
    axios
      .delete("http://localhost:5000/comment/delete", {
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
        data: {
          comment_id: props.idData,
        },
      })
      .then(() => {
        props.getComments();
        props.toast("Коментарът е изтрит", {
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
            {props.el[0].reply_content == null
              ? "Няма отговори"
              : props.el[0].reply_content !== null && props.el.length == 1
              ? "1 отговор"
              : props.el[0].reply_content !== null && props.el.length == 2
              ? "2 отговора"
              : props.el.length + " отговори"}
          </Typography>

          {verify() && (
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
          {verify() && ID() == props.user_id && (
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
            getComments={props.getComments}
            toast={props.toast}
            relating={props.el[0].comments_id}
            setReply={setReply}
          />
        )}
        {props.el[0].reply_content !== null &&
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
            />
          ))}
      </Box>
    </Box>
  );
};
const AddComment = (props) => {
  const [content, setContent] = React.useState("");
  const verify = () => {
    try {
      let a = jwt_decode(localStorage.getItem("jwt"));
      return a.user_id;
    } catch (err) {
      return false;
    }
  };
  const add = () => {
    if (!content.length) {
      props.toast.warn("Не може да публикувате празен коментар", {
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
    if (content.length > 500) {
      props.toast.warn(
        "Не може да публикувате коментар по-дълъг от 500 символа",
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
      return false;
    }
    axios
      .request({
        method: "POST",
        url: `http://localhost:5000/comment`,
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
        data: {
          place_id: props.place_id,
          comment: content,
        },
      })
      .then((data) => {
        props.toast("Коментарът е публикуван", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        props.getComments();
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
        } else if (err.response.status == 409) {
          props.toast.warn("Коментарът вече съществува", {
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
    <Box>
      <Box className="mainSend">
        <TextField
          id="outlined-textarea"
          label="Напиши коментар"
          multiline
          variant="outlined"
          style={{ width: "80%" }}
          inputProps={{ maxLength: 500 }}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          size="large"
          className="postButton"
          variant="contained"
          endIcon={<SendIcon />}
          onClick={() => add()}
        >
          Постни
        </Button>
      </Box>
      <Box style={{ display: "flex", justifyContent: "space-between" }}>
        {content ? (
          <Typography style={{ color: content.length > 500 && "red" }}>
            {content.length}/500 символа
          </Typography>
        ) : (
          ""
        )}
        {props.data.length ? (
          <FormControl variant="outlined">
            <Select
              onChange={(e) => {
                props.setSort(e.target.value);
              }}
              defaultValue={0}
              labelId="category-label"
              id="category"
            >
              <MenuItem value={0}>По подразбиране</MenuItem>
              <MenuItem value={1}>Харесвание възходящ ред</MenuItem>
              <MenuItem value={2}>Харесване низходящ ред</MenuItem>
              <MenuItem value={3}>Дата скорошни</MenuItem>
              <MenuItem value={4}>Дата отдавнашни</MenuItem>
            </Select>
            <FormHelperText>Сортиране</FormHelperText>
          </FormControl>
        ) : (
          ""
        )}
      </Box>
    </Box>
  );
};
const AddReply = (props) => {
  const [content, setContent] = React.useState("");
  const verify = () => {
    try {
      let a = jwt_decode(localStorage.getItem("jwt"));
      return a.user_id;
    } catch (err) {
      return false;
    }
  };
  const add = () => {
    if (!content.length) {
      props.toast.warn("Не може да публикувате празен отговор", {
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
    if (content.length > 500) {
      props.toast.warn(
        "Не може да публикувате отговор по-дълъг от 500 символа",
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
      return false;
    }
    axios
      .request({
        method: "POST",
        url: `http://localhost:5000/reply`,
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
        data: {
          relating: props.relating,
          comment: content,
        },
      })
      .then((data) => {
        props.setReply(false);
        props.toast("Отговорът е публикуван", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        props.getComments();
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
  return (
    <Box>
      <Box className="mainSend">
        <TextField
          id="outlined-textarea"
          label="Напиши отговор"
          multiline
          variant="outlined"
          style={{ width: "80%" }}
          inputProps={{ maxLength: 500 }}
          onChange={(e) => setContent(e.target.value)}
        />

        <Button
          size="large"
          className="postButton"
          variant="contained"
          endIcon={<SendIcon />}
          onClick={() => add()}
          style={{ marginLeft: "1vmax" }}
        >
          Постни
        </Button>
      </Box>
      {content && (
        <Typography style={{ color: content.length > 500 && "red" }}>
          {content.length}/500 символа
        </Typography>
      )}
    </Box>
  );
};
const Comments = (props) => {
  let [data, setData] = React.useState(props.data);
  let [sortFunc, setSort] = React.useState(1);
  React.useLayoutEffect(() => {
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
      if (sortFunc == 2) {
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
      } else if (sortFunc == 1) {
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
  return (
    <Box>
      {verify() ? (
        <AddComment
          data={data}
          setData={setData}
          toast={props.toast}
          place_id={props.place_id}
          getComments={props.getComments}
          setSort={setSort}
        />
      ) : (
        <center style={{ margin: "1vmax" }}>
          Регистрирайте се, за да пишете коментари
        </center>
      )}
      {data.length &&
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
          />
        ))}
    </Box>
  );
};
export default Comments;
