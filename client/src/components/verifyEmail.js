import React from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";

const axios = require("axios");
const Verify = (props) => {
  const history = useHistory();
  const check = () => {
    axios
      .get("http://localhost:5000/verified", {
        headers: { jwt: localStorage.getItem("jwt") },
      })
      .then((data) => {
        history.push("/profile");
        localStorage.setItem("jwt", data.data.jwt);
        props.toast("Имейла е потвърден!", {
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
          toast.error(
            "Потребител с тези данни не съществува. Създайте акаунта си отново!",
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
          toast.warn("Все още не сте потвърдили акаунта си!", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (err.response.status == 500) {
          toast.error("Грешка в сървъра. Пробвайте отново", {
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
  const sendMail = () => {
    axios
      .get("http://localhost:5000/newMail", {
        headers: { jwt: localStorage.getItem("jwt") },
      })
      .then((data) => {
        toast.success("Имейла е изпратен, проверете пощата си", {
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
        if (err.response.status == 500) {
          toast.error("Грешка в сървъра. Пробвайте отново", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (err.response.status == 400) {
          toast.error("Невалидни данни. Създайте акаунта си отново!", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (err.response.status == 403) {
          toast.warn("Акаунта вече е потвърден", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (err.response.status == 429) {
          toast.warn(
            "Изчакайте поне две минути преди да натиснете бутона за изпращане на повторен имейл!",
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
    <div>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Container className="verify" maxWidth="sm">
        <Typography variant="h3">Не сте потвърдили имейла си.</Typography>
        <Divider />
        <Typography variant="h5">
          Натиснете изпратения по имейл линк след това бутона отдолу, за да
          пратим конфигурация на браузъра Ви. Няма да се налага да извършвате
          процедурата повторно.
        </Typography>
        <Button
          onClick={check}
          style={{ textTransform: "none" }}
          variant="contained"
        >
          Провери
        </Button>
        <Divider />
        <Typography variant="h5">
          Потърсете в спам секцията на пощата и ако все още не намирате имейла,
          натиснете бутона долу
        </Typography>
        <Button
          onClick={sendMail}
          style={{ textTransform: "none" }}
          variant="contained"
        >
          Изпрати отново
        </Button>
      </Container>
    </div>
  );
};

export default Verify;
