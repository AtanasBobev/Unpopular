import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { confirmAlert } from "react-confirm-alert";

import axios from "axios";

const Delete = (props) => {
  const [password, setPassword] = React.useState();
  const deleteProfile = () => {
    axios
      .request({
        url: "http://localhost:5000/user/delete",
        method: "DELETE",
        data: { password: password },
        headers: { jwt: localStorage.getItem("jwt") },
      })
      .then(() => {
        props.setDelete(false);
        props.toast("Заявката е изпратена. Проверете си имейла", {
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
        if (err.response.status == 401) {
          props.toast.warn("Грешна парола", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          props.toast.error("Сървърна грешка", {
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
      <TextField
        inputProps={{ maxLength: 100 }}
        gutterBottom
        type="password"
        style={{ width: "100%", marginBottom: "2vmax", marginTop: "1vmax" }}
        placeholder="Потвърдете парола"
        onChange={(e) => setPassword(e.target.value)}
      ></TextField>
      <center>
        <Button
          onClick={() => {
            deleteProfile();
          }}
          style={{ textTransform: "none" }}
          variant="outlined"
        >
          Изтрий профил
        </Button>
      </center>
    </Box>
  );
};
export default Delete;
