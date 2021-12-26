import React from "react";
import Typography from "@material-ui/core/Typography";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Image from "material-ui-image";
import Link from "@material-ui/core/Link";

const axios = require("axios");

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: theme.typography.pxToRem(12),
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
  },
}));
const ImageTooltip = (props) => {
  const [posts, setPosts] = React.useState(0);
  return (
    <HtmlTooltip
      onMouseEnter={() => {
        axios
          .get(`http://localhost:5000/user/preview`, {
            params: {
              username: props.author,
            },
          })
          .then((data) => {
            setPosts(Number(data.data));
          });
      }}
      title={
        <React.Fragment>
          <center>
            {props.avatar && (
              <Image
                style={{
                  width: "10vw",
                }}
                src={"http://localhost:5000/image/" + props.avatar}
              />
            )}
            <Link
              target="_blank"
              style={{ textAlign: "center", fontSize: "3vmax", color: "black" }}
              href={"http://localhost:3000/profile/" + props.author}
            >
              {" "}
              {props.author}
            </Link>
            <Typography style={{ textAlign: "center" }} variant="h6">
              {"Качени " +
                posts +
                (posts > 1 ? " места" : posts == 1 ? " място" : " места")}
            </Typography>
          </center>
        </React.Fragment>
      }
    >
      <div className={"tooltipButton"}>
        {props.avatar && (
          <img
            style={{
              borderRadius: "50%",
              width: "1.5rem",
              height: "1.5rem",
              marginRight: "0.5vmax",
            }}
            src={"http://localhost:5000/image/" + props.avatar}
          />
        )}
        <Link
          target="_blank"
          style={{ color: "black" }}
          href={"http://localhost:3000/profile/" + props.author}
        >
          {" "}
          {props.author}
        </Link>
      </div>
    </HtmlTooltip>
  );
};
export default ImageTooltip;
