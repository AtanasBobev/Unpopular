import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import SearchSharpIcon from "@material-ui/icons/SearchSharp";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import PublishOutlinedIcon from "@material-ui/icons/PublishOutlined";
import TypeWriterEffect from "react-typewriter-effect";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FadeIn from "react-fade-in";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import ExploreOutlinedIcon from "@material-ui/icons/ExploreOutlined";
import TagFacesOutlinedIcon from "@mui/icons-material/TagFacesOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useLocation } from "react-router-dom";
import PublishIcon from "@mui/icons-material/Publish";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SubjectIcon from "@mui/icons-material/Subject";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

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
  const location = useLocation();
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
                multiText={["#404", "Неизвестно"]}
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
              {props.ls() && !props.lsA() && (
                <Button
                  size={"large"}
                  style={{ textTransform: "none" }}
                  startIcon={<EmailOutlinedIcon />}
                  component={Link}
                  to="/verify"
                >
                  Потвърди профила
                </Button>
              )}
              {props.lsA() ? (
                <div>
                  <Button
                    size={"large"}
                    style={{ textTransform: "none" }}
                    startIcon={
                      location.pathname.substring(1) == "favorite" ? (
                        <FavoriteIcon style={{ color: "red" }} />
                      ) : (
                        <FavoriteBorderIcon />
                      )
                    }
                    component={Link}
                    to="/favorite"
                  >
                    Любими
                  </Button>
                  <Button
                    size={"large"}
                    style={{ textTransform: "none" }}
                    startIcon={
                      location.pathname.substring(1) == "saved" ? (
                        <BookmarkIcon style={{ color: "gold" }} />
                      ) : (
                        <BookmarkBorderIcon />
                      )
                    }
                    component={Link}
                    to="/saved"
                  >
                    Запазени
                  </Button>
                  <Button
                    size={"large"}
                    style={{ textTransform: "none" }}
                    startIcon={
                      location.pathname.substring(1) == "profile" ? (
                        <PersonIcon />
                      ) : (
                        <PersonOutlineIcon />
                      )
                    }
                    component={Link}
                    to="/profile"
                  >
                    Профил
                  </Button>
                  <Button
                    className="uploadButton"
                    size={"large"}
                    style={{ textTransform: "none" }}
                    startIcon={
                      location.pathname.substring(1) == "upload" ? (
                        <PublishIcon />
                      ) : (
                        <PublishOutlinedIcon />
                      )
                    }
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
                startIcon={
                  location.pathname.substring(1) == "info" ? (
                    <EmojiEmotionsIcon />
                  ) : (
                    <TagFacesOutlinedIcon />
                  )
                }
                component={Link}
                to="/info"
              >
                За проекта
              </Button>
            </FadeIn>
          </Toolbar>
        </AppBar>
      </div>
    </div>
  );
};

export default TopBar;
