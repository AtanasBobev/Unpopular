import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import SearchSharpIcon from "@material-ui/icons/SearchSharp";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import PublishOutlinedIcon from "@material-ui/icons/PublishOutlined";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import TypeWriterEffect from "react-typewriter-effect";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FadeIn from "react-fade-in";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import ExploreOutlinedIcon from "@material-ui/icons/ExploreOutlined";
import { Link } from "react-router-dom";
const styles = {
  root: {
    flexGrow: 1,
    backgroundColor: "black",
  },
  appbar: {
    alignItems: "center",
    zIndex: "10000",
  },
  center: {
    width: "100%",
  },
  flex: {
    flex: "1",
  },
};

const TopBar = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="indexed">
      <div className="indexed" className={styles.root}>
        <AppBar color="default">
          <Toolbar styles={styles.center}>
            <Typography className="title flex" align="center" variant="h4">
              <TypeWriterEffect
                startDelay={100}
                cursorColor="#F8F8FF"
                hideCursorAfterText="true"
                multiText={["Unpopular", "Неизвестно"]}
                multiTextDelay={1500}
                typeSpeed={80}
              />
            </Typography>
            <FadeIn delay={100} transitionDuration={1000} className="fading">
              <Button
                component={Link}
                to="/search"
                className="searchButton"
                variant="outlined"
                size={"large"}
                style={{ textTransform: "none" }}
                startIcon={<SearchSharpIcon />}
              >
                Търси
              </Button>
              {props.lsA() ? (
                <div>
                  <Button
                    size={"large"}
                    style={{ textTransform: "none" }}
                    startIcon={<FavoriteBorderIcon />}
                    component={Link}
                    to="/favorite"
                  >
                    Любими
                  </Button>
                  <Button
                    size={"large"}
                    style={{ textTransform: "none" }}
                    startIcon={<BookmarkBorderIcon />}
                    component={Link}
                    to="/saved"
                  >
                    Запазени
                  </Button>
                  <Button
                    size={"large"}
                    style={{ textTransform: "none" }}
                    startIcon={<PersonOutlineIcon />}
                    component={Link}
                    to="/profile"
                  >
                    Профил
                  </Button>
                  <Button
                    className="uploadButton"
                    size={"large"}
                    style={{ textTransform: "none" }}
                    startIcon={<PublishOutlinedIcon />}
                    component={Link}
                    to="/upload"
                  >
                    Качи
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    startIcon={<CreateOutlinedIcon />}
                    size={"large"}
                    style={{ textTransform: "none" }}
                    component={Link}
                    to="/register"
                  >
                    Регистрация
                  </Button>
                  <Button
                    startIcon={<ExploreOutlinedIcon />}
                    size={"large"}
                    style={{ textTransform: "none" }}
                    component={Link}
                    to="/login"
                  >
                    Влизане
                  </Button>
                </div>
              )}

              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
                size={"large"}
                style={{ textTransform: "none" }}
                startIcon={<MoreHorizOutlinedIcon />}
                component={Link}
                to="/more"
              >
                Още
              </Button>
            </FadeIn>
          </Toolbar>
        </AppBar>
      </div>
    </div>
  );
};

export default TopBar;
