import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Divider from "@mui/material/Divider";
const axios = require("axios");
const Avatar = (props) => {
  const [newAvatar, setNewAvatar] = React.useState(false);

  const upload = () => {
    const data = new FormData();
    data.append("images", props.files[0]);
    console.log(props.files);
    axios
      .post("http://localhost:5000/user/avatar", data, {
        headers: { jwt: localStorage.getItem("jwt") },
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
        {props.files && (
          <>
            <img
              style={{
                height: "20vh",
                width: "20vh",
                borderRadius: "50%",
                userSelect: "none",
              }}
              src={props.files[0] && URL.createObjectURL(props.files[0])}
            />
          </>
        )}

        <label htmlFor="raised-button-file">
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
              <Divider />
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
