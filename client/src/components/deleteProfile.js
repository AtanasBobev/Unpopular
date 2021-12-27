import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { confirmAlert } from "react-confirm-alert";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ToggleIcon from "material-ui-toggle-icon";
import axios from "axios";

const Delete = (props) => {
  const [password, setPassword] = React.useState();
  const [token, setToken] = React.useState();
  const [passwordShow, setShowPassword] = React.useState(false);
  const deleteProfile = () => {
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
      <Input
        inputProps={{ maxLength: 100 }}
        gutterBottom
        type={passwordShow ? "text" : "password"}
        style={{ width: "100%", marginBottom: "2vmax", marginTop: "1vmax" }}
        placeholder="Потвърдете парола"
        onBlur={(e) => setPassword(e.target.value)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="Покажи/скрий паролата"
              onClick={() => setShowPassword((state) => !state)}
              edge="end"
            >
              <ToggleIcon
                on={passwordShow}
                onIcon={<Visibility />}
                offIcon={<VisibilityOff />}
              />
            </IconButton>
          </InputAdornment>
        }
      ></Input>
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
