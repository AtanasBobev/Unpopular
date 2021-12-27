import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
const ForgottenPassword = (props) => {
  const [cred, setCred] = React.useState();
  const sendLink = (e) => {
    e.preventDefault();
    axios
      .request({
        url: "http://localhost:5000/user/password/forgotten",
        method: "PUT",
        data: { cred: cred },
      })
      .then(() => {
        props.setOpenPassword(false);
        props.toast("Ако въведените данни са верни, ще получите линк", {
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
        props.error("Неспецифична грешка", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };
  return (
    <Box>
      <form onSubmit={sendLink}>
        <Typography>Въведе имейла си или потребителското име</Typography>
        <TextField
          onBlur={(e) => setCred(e.target.value)}
          style={{ width: "100%" }}
          label="Потребителско име/имейл"
          className="inputField"
          margin="normal"
          inputProps={{ maxLength: 100 }}
          required
        />
        <Button
          type="submit"
          style={{ textTransform: "none" }}
          variant="contained"
          color="primary"
        >
          Изпрати
        </Button>
      </form>
    </Box>
  );
};
export default ForgottenPassword;
