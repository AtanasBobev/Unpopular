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
const AddComment = (props) => {
  const [content, setContent] = React.useState("");
  const [token, setToken] = React.useState();

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
    if (!token) {
      props.toast.warn("Не сте потвърдили, че не сте робот", {
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
    axios
      .request({
        method: "POST",
        url: `http://localhost:5000/comment`,
        headers: {
          jwt: localStorage.getItem("jwt"),
          token: token,
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
        props.refreshData();
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
          label={
            verify()
              ? "Напиши коментар"
              : localStorage.getItem("jwt")
              ? "Потвърдете си профила, за да пишете коментари"
              : "Регистрирайте се, за да пишете коментари"
          }
          disabled={!verify()}
          multiline
          variant="outlined"
          style={{ width: "80%" }}
          inputProps={{ maxLength: 500 }}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          size="large"
          disabled={!verify()}
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

        {props.data ? (
          <FormControl variant="outlined">
            <Select
              onChange={(e) => {
                props.setSort(Number(e.target.value));
              }}
              defaultValue={0}
              labelId="category-label"
              id="category"
            >
              <MenuItem value={0}>Текущо</MenuItem>
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
        {verify() && (
          <HCaptcha
            sitekey="10000000-ffff-ffff-ffff-000000000001"
            size="normal"
            languageOverride="bg"
            onVerify={(token) => {
              setToken(token);
            }}
            onError={() => {
              props.toast.warn(
                "Имаше грешка при потвърждаването, че не сте робот, пробвайте отново",
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
            }}
            onExpire={() => {
              props.toast.warn("Потвърдете отново, че не сте робот", {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }}
          />
        )}
      </Box>
    </Box>
  );
};
export default AddComment;
