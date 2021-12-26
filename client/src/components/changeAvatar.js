import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Divider from "@mui/material/Divider";
import Image from "material-ui-image";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const axios = require("axios");
const Avatar = (props) => {
  const [newAvatar, setNewAvatar] = React.useState(false);
  const [token, setToken] = React.useState();
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
      .post("http://localhost:5000/user/avatar", data, {
        headers: { jwt: localStorage.getItem("jwt"), token: token },
      })
      .then(() => {
        props.setOpenAvatar(false);
        props.toast.success("Качването е успешно", {
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
        props.toast.error(
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
          multiple
          type="file"
          onChange={(e) => {
            console.log(e.target.files);
            if (e.target.files.length > 1) {
              props.toast.error(
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
            if (e.target.files) {
              setNewAvatar(true);
              props.setFiles(e.target.files);
            }
          }}
        />
        {props.files.length ? (
          <>
            <Image
              draggable="false"
              style={{
                height: "20vh",
                width: "20vh",
                borderRadius: "50%",
                userSelect: "none",
              }}
              src={props.files[0] && URL.createObjectURL(props.files[0])}
            />
          </>
        ) : (
          props.avatar && (
            <>
              <Image
                draggable="false"
                style={{
                  height: "20vh",
                  width: "20vh",
                  borderRadius: "50%",
                  userSelect: "none",
                }}
                src={"http://localhost:5000/image/" + props.avatar}
              />
            </>
          )
        )}
        <HCaptcha
          sitekey="10000000-ffff-ffff-ffff-000000000001"
          size="normal"
          languageOverride="bg"
          onVerify={(token) => {
            setToken(token);
          }}
          onError={() => {
            toast.warn(
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
            toast.warn("Потвърдете отново, че не сте робот", {
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
          <center></center>
          {newAvatar ||
            (props.avatar && (
              <Button
                style={{ textTransform: "none", margin: "1vmax" }}
                variant="outlined"
                onClick={() => {
                  axios
                    .delete("http://localhost:5000/avatar/delete", {
                      headers: { jwt: localStorage.getItem("jwt") },
                    })
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
            ))}
          <center>
            <Button
              style={{ textTransform: "none", margin: "1vmax" }}
              variant="outlined"
              component="span"
            >
              Качи нова снимка
            </Button>
          </center>
          {newAvatar && (
            <>
              <Button
                style={{ textTransform: "none", margin: "1vmax" }}
                variant="outlined"
                onClick={upload}
              >
                Потвърди аватара
              </Button>
            </>
          )}
        </label>
      </center>
    </Box>
  );
};

export default Avatar;
