import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PlaceIcon from "@mui/icons-material/Place";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import { toast } from "react-toastify";

const axios = require("axios");

const UserComplains = (props) => {
  const [score, setScore] = React.useState(Number(props.priority));
  React.useEffect(() => {
    console.log(score);
    if (score < -1) {
      setScore(-1);
    }
    if (score == -1) {
      axios
        .request({
          url: "http://localhost:5000/complain",
          method: "DELETE",
          data: { report_id: props.report_id },
          headers: { jwt: localStorage.getItem("jwt") },
        })
        .then(() => {
          props.deleteMe(props.report_id);
          toast.success("Докладът е изтрит", {
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
          setScore(0);
          toast.error("Имаше проблем при изтриването на доклада", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    } else {
      axios
        .request({
          url: "http://localhost:5000/complain/score",
          method: "PUT",
          data: { report_id: props.report_id, priority: score },
          headers: { jwt: localStorage.getItem("jwt") },
        })
        .catch((err) => {
          toast.error("Имаше проблем при изпълнение на действието", {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    }
  }, [score]);
  return (
    <Box className="complainBox">
      <Box className="firstRowComplain">
        <Typography> {props.date}</Typography>
        <Typography>
          {props.type == "place" ? (
            <PlaceIcon />
          ) : (
            props.type == "comment" && <ModeCommentIcon />
          )}
        </Typography>
      </Box>
      <Typography style={{ padding: "1vmax" }}>{props.content}</Typography>
      <Box className="lastRowComplain">
        <IconButton
          onClick={() => {
            setScore((prev) => prev - 1);
          }}
          children={<RemoveIcon />}
        />
        <Typography style={{ padding: "1vmax" }} variant="h5">
          {score}
        </Typography>
        <IconButton
          onClick={() => {
            setScore((prev) => prev + 1);
          }}
          children={<AddIcon />}
        />
      </Box>
    </Box>
  );
};
export default UserComplains;
