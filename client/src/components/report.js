import React from "react";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
const Report = (props) => {
  const [text, setText] = React.useState("");
  const submit = () => {
    if (Number(text.length) < 20) {
      props.toast.warn(
        "За да изпратите доклад трябва да напишете поне 20 символа",
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
    if (Number(text.length) > 500) {
      props.toast.warn("Броя символи не може да превишава 500", {
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
      .post(
        "http://localhost:5000/report",
        {
          item_id: props.item_id,
          type: props.type,
          reason: text,
        },
        { headers: { jwt: localStorage.getItem("jwt") } }
      )
      .then(() => {
        props.setReportOpen(false);
        props.toast("Докладът е изпратен усешно", {
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
        if (err.response.status == 409) {
          props.toast.warn("Доклад със същото съдъражение вече съществува", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          props.toast.error("Имаше грешка при изпращането на доклада", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });
  };
  return (
    <Box>
      <center>
        <TextField
          style={{ width: "100%", marginTop: "2vmax" }}
          variant="outlined"
          onBlur={(e) => setText(e.target.value)}
          multiline
          rows={10}
          inputProps={{ maxLength: 500 }}
          placeholder="Опишете проблема в до 500 символа"
        />
        <Typography style={{ textAlign: "left", margin: "0.2vmax" }}>
          {text.length} символи
        </Typography>
        <Button
          style={{ textTransform: "none", margin: "1vmax" }}
          variant="contained"
          onClick={submit}
        >
          Изпрати
        </Button>
      </center>
    </Box>
  );
};
export default Report;
