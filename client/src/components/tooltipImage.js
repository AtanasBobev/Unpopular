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
          .get(`https://unpopular-backend.herokuapp.com/user/preview`, {
            params: {
              username: props.author,
              user_id: props.user_id,
            },
          })
          .then((data) => {
            setPosts(data.data);
          });
      }}
      title={
        <React.Fragment>
          <center>
            {(props.avatar || posts.avatar) && (
              <Image
                style={{
                  width: "100%",
                  height: "auto",
                  pointerEvents: "none",
                }}
                src={posts.avatar}
              />
            )}
            <Link
              target="_blank"
              style={{ textAlign: "center", fontSize: "3vmax", color: "black" }}
              href={
                "/profile/" + (props.author ? props.author : posts.username)
              }
            >
              {" "}
              {props.author ? props.author : posts.username}
            </Link>
            <Typography style={{ textAlign: "center" }} variant="h6">
              {"Качени " +
                Number(posts.count) +
                (Number(posts.count) > 1
                  ? " места"
                  : posts == 1
                  ? " място"
                  : " места")}
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
              width: window.innerWidth < window.innerHeight ? "6vw" : "1.5vw",
              marginRight: "0.2vmax",
              pointerEvents: "none",
            }}
            src={"" + props.avatar}
          />
        )}
        <Link
          target="_blank"
          style={{ color: !props.white ? "black" : "white" }}
          href={"/profile/" + (props.author ? props.author : posts.username)}
        >
          {" "}
          {props.author ? props.author : posts.username}
        </Link>
      </div>
    </HtmlTooltip>
  );
};
export default ImageTooltip;
