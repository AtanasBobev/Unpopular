import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Divider from "@mui/material/Divider";
import Image from "material-ui-image";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { toast } from "react-toastify";
const acceptedImageTypes = ["image/jpeg", "image/png", "image/jpg"];

const axios = require("axios");
const Avatar = (props) => {
  const [token, setToken] = React.useState();

  React.useEffect(() => {
    if (!props.files.length) {
      return false;
    }
    if (props.files.length > 1) {
      props.setFiles(props.files[0]);
    }
    if (!acceptedImageTypes.includes(props.files[0]["type"])) {
      props.toast.warn("Позволените формати са jpeg и png", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      props.setFiles((prev) => prev.filter((b) => b.name !== prev[0].name));
      return false;
    }
    if (props.files[0].size > 3e6) {
      props.toast.warn(
        "Снимката е с размер " +
          (props.files[0].size / 1e6).toFixed(2) +
          " МБ. Максималният позволен е 3МБ",
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
      props.setFiles((prev) => prev.filter((b) => Number(b.size) <= 3e6));
      return false;
    }
  }, [props.files]);

  const upload = () => {
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
    const data = new FormData();
    data.append("images", props.files[0]);
    axios
      .post("https://unpopular-backend.herokuapp.com/user/avatar", data, {
        headers: { jwt: localStorage.getItem("jwt"), token: token },
      })
      .then(() => {
        props.setOpenAvatar(false);
        props.toast("Готово", {
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
        props.toast.warn(
          "Не е позволено качването на повече от 1 снимки с размер до 3 МБ",
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
  return (
    <Box>
      <center>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="raised-button-file"
          type="file"
          onChange={(e) => {
            if (e.target.files.length > 1) {
              props.toast.warn(
                "Не е позволено качването на повече от 1 снимки с размер до 3 МБ",
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
            props.setFiles((prev) => {
              return Array.from(e.target.files.length ? e.target.files : prev);
            });
          }}
        />
        {props.files.length ? (
          <>
            <img
              draggable="false"
              style={{
                width: "80%",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
              src={props.files[0] && URL.createObjectURL(props.files[0])}
            />
          </>
        ) : (
          props.avatar && (
            <>
              <img
                draggable="false"
                style={{
                  width: "80%",
                  borderRadius: "50%",
                  userSelect: "none",
                }}
                src={"" + props.avatar}
              />
            </>
          )
        )}
        <HCaptcha
          sitekey="f21dbfcd-0f79-42dd-ac97-2a7b6b63980a"
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
        <label htmlFor="raised-button-file">
          {props.avatar && (
            <Button
              style={{ textTransform: "none", margin: "1vmax" }}
              variant="outlined"
              onClick={() => {
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
                  .delete(
                    "https://unpopular-backend.herokuapp.com/avatar/delete",
                    {
                      headers: {
                        jwt: localStorage.getItem("jwt"),
                        token: token,
                      },
                    }
                  )
                  .then(() => {
                    props.setOpenAvatar(false);
                    props.setFiles([]);
                    props.setAvatar("");
                    props.toast("Аватарът е изтрит", {
                      position: "bottom-left",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                  });
              }}
            >
              Премахни аватар
            </Button>
          )}
          <center>
            <Button
              style={{ textTransform: "none", margin: "1vmax" }}
              variant="outlined"
              component="span"
            >
              Качи нова снимка
            </Button>
          </center>
          {props.files.length ? (
            <>
              <Button
                style={{ textTransform: "none", margin: "1vmax" }}
                variant="outlined"
                onClick={upload}
              >
                Потвърди аватара
              </Button>
            </>
          ) : (
            ""
          )}
        </label>
      </center>
    </Box>
  );
};

export default Avatar;
