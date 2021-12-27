import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ToggleIcon from "material-ui-toggle-icon";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const passwordValidator = require("password-validator");

let schema = new passwordValidator();
schema
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .digits(2)
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf([
    "12345678",
    "123456789",
    "1234567890",
    "password",
    "qwerty123",
    "1234567890",
    "11111111",
    "iloveyou",
    "987654321",
    "superman",
    "iloveyou1",
    "Bulgaria",
    "bulgaria",
  ]);
const Password = (props) => {
  const [password, setPassword] = React.useState();
  const [newPassword, setNewPassword] = React.useState();
  const [newPassword2, setNewPassword2] = React.useState();
  const [token, setToken] = React.useState();
  const [passwordShow1, setShowPassword1] = React.useState(false);
  const [passwordShow2, setShowPassword2] = React.useState(false);
  const [passwordShow3, setShowPassword3] = React.useState(false);

  const updateName = () => {
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
    if (newPassword2 !== newPassword) {
      props.toast.warning("Паролите не съвпадат", {
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
    if (newPassword.length > 100) {
      props.toast("Не може паролата да e над 100 символа", {
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
    if (newPassword.length < 8) {
      props.toast("Не може паролата да е под 8 символа", {
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
    if (!schema.validate(newPassword)) {
      props.toast.warn(
        "Паролата трябва да е поне 8 символа, да съдържа две цифри, малки и главни бувки и да не е често използвана като: 123456789 и подобни",
        {
          position: "bottom-left",
          autoClose: 15000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      return false;
    }
    if (/\p{Extended_Pictographic}/u.test(newPassword)) {
      toast.warn("Не е позволено използването на емоджита", {
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
        url: "http://localhost:5000/user/password",
        method: "PUT",
        data: { password: password, newPassword: newPassword },
        headers: { jwt: localStorage.getItem("jwt"), token: token },
      })
      .then(() => {
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
        if (err.response.status == 409) {
          props.toast.warn(
            "Може би сте актуализирали името си. Трябва да влезете отново",
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
        } else if (err.response.status == 405) {
          props.toast.warn(
            "Вече сте използвали системата за изпращане на имейли. Тъй като използваме имейл, който има ограничение, а системата е безплатна, трябва да се съобразяваме с днвена квота. Изчакайате поне 3 минути преди да си промените имейла, името или паролата.",
            {
              position: "bottom-left",
              autoClose: 15000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
        } else if (err.response.status == 401) {
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
          props.toast.warn("Сървърна грешка", {
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
      <FormControl
        style={{ marginTop: "1.5vmax", marginBottom: "1vmax", width: "100%" }}
        variant="standard"
      >
        <InputLabel htmlFor="standard-adornment-password">
          Нова парола
        </InputLabel>

        <Input
          style={{
            width: "100%",
            marginBottom: "2vmax",
            marginTop: "1vmax",
          }}
          onBlur={(e) => setNewPassword(e.target.value)}
          inputProps={{ maxLength: 100 }}
          id="standard-name"
          label="Нова парола"
          type={passwordShow1 ? "text" : "password"}
          className="inputField"
          margin="normal"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="Покажи/скрий паролата"
                onClick={() => setShowPassword1((state) => !state)}
                edge="end"
              >
                <ToggleIcon
                  on={passwordShow1}
                  onIcon={<Visibility />}
                  offIcon={<VisibilityOff />}
                />
              </IconButton>
            </InputAdornment>
          }
          required
        />
      </FormControl>
      <FormControl
        style={{ marginTop: "1.5vmax", marginBottom: "1vmax", width: "100%" }}
        variant="standard"
      >
        <InputLabel htmlFor="standard-adornment-password">
          Повторете новата парола
        </InputLabel>

        <Input
          style={{
            width: "100%",
            marginBottom: "2vmax",
            marginTop: "1vmax",
          }}
          onBlur={(e) => setNewPassword2(e.target.value)}
          inputProps={{ maxLength: 100 }}
          id="standard-name"
          label="Потвърдете новата парола"
          type={passwordShow2 ? "text" : "password"}
          className="inputField"
          margin="normal"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="Покажи/скрий паролата"
                onClick={() => setShowPassword2((state) => !state)}
                edge="end"
              >
                <ToggleIcon
                  on={passwordShow2}
                  onIcon={<Visibility />}
                  offIcon={<VisibilityOff />}
                />
              </IconButton>
            </InputAdornment>
          }
          required
        />
      </FormControl>
      <FormControl
        style={{ marginTop: "1.5vmax", marginBottom: "1vmax", width: "100%" }}
        variant="standard"
      >
        <InputLabel htmlFor="standard-adornment-password">
          Текуща парола
        </InputLabel>

        <Input
          style={{
            width: "100%",
            marginBottom: "2vmax",
            marginTop: "1vmax",
          }}
          onBlur={(e) => setPassword(e.target.value)}
          inputProps={{ maxLength: 100 }}
          id="standard-name"
          label="Текуща парола"
          type={passwordShow3 ? "text" : "password"}
          className="inputField"
          margin="normal"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="Покажи/скрий паролата"
                onClick={() => setShowPassword3((state) => !state)}
                edge="end"
              >
                <ToggleIcon
                  on={passwordShow3}
                  onIcon={<Visibility />}
                  offIcon={<VisibilityOff />}
                />
              </IconButton>
            </InputAdornment>
          }
          required
        />
      </FormControl>
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
      <center>
        <Button
          onClick={updateName}
          style={{ textTransform: "none" }}
          variant="outlined"
        >
          Промени
        </Button>
      </center>
    </Box>
  );
};
export default Password;
