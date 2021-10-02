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
import jwt_decode from "jwt-decode";
const axios = require("axios");
const moment = require("moment");
moment.locale("bg");
const Reply = (props) => {
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
          props.toast.error("Отговорът вече съществува", {
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
            style={{ alignSelf: "flex-start", flex: 1, marginTop: "1.3vmax" }}
          >
            От: {props.author} | Дата: {moment(props.date).format("llll")}
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
          <IconButton
            style={{ marginRight: "0.5vmax" }}
            aria-label="Съобщи за нередност"
          >
            <ReportOutlinedIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
const Comment = (props) => {
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
            style={{ alignSelf: "flex-start", flex: 1, marginTop: "1.3vmax" }}
          >
            От: {props.author} | Дата: {moment(props.date).format("llll")}
            {" | "}
            {props.el[0].reply_content == null
              ? "Няма отговори"
              : props.el[0].reply_content !== null && props.el.length == 1
              ? "1 отговор"
              : props.el[0].reply_content !== null && props.el.length == 2
              ? "2 отговора"
              : props.el.length + " отговори"}
          </Typography>
          <Button
            onClick={() => setReply(!reply)}
            startIcon={<ReplyIcon />}
            style={{ textTransform: "none" }}
          >
            Отговори
          </Button>
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
          <IconButton
            style={{ marginRight: "0.5vmax" }}
            aria-label="Съобщи за нередност"
          >
            <ReportOutlinedIcon />
          </IconButton>
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
      props.toast.error("Не може да публикувате празен коментар", {
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
      props.toast.error(
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
    <Box className="mainSend">
      <TextField
        id="outlined-textarea"
        label="Напиши коментар"
        multiline
        variant="outlined"
        style={{ width: "80%" }}
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
      props.toast.error("Не може да публикувате празен отговор", {
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
      props.toast.error(
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
    <Box className="mainSend">
      <TextField
        id="outlined-textarea"
        label="Напиши отговор"
        multiline
        variant="outlined"
        style={{ width: "80%" }}
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
  );
};
const Comments = (props) => {
  let [data, setData] = React.useState(props.data);
  React.useEffect(() => {
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
      {verify() && (
        <AddComment
          data={data}
          setData={setData}
          toast={props.toast}
          place_id={props.place_id}
          getComments={props.getComments}
        />
      )}
      {data.map((el) => (
        <Comment
          key={Math.random}
          getComments={props.getComments}
          idData={el[0].comments_id}
          score={el[0].comment_score}
          content={el[0].comment_content}
          author={el[0].username}
          user_id={el[0].user_id}
          date={el[0].comment_date}
          comments_actions={el[0].comments_actions}
          el={el}
          toast={props.toast}
        />
      ))}
    </Box>
  );
};
export default Comments;
