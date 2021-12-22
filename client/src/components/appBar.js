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
import { Link, useLocation } from "react-router-dom";
import PublishIcon from "@mui/icons-material/Publish";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SubjectIcon from "@mui/icons-material/Subject";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SentimentVerySatisfiedOutlinedIcon from "@mui/icons-material/SentimentVerySatisfiedOutlined";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import Box from "@material-ui/core/Box";
import jwt_decode from "jwt-decode";

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
  const [adminUser, setAdminUser] = React.useState("user");
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const isAdmin = () => {
    try {
      if (Boolean(jwt_decode(localStorage.getItem("jwt")).admin)) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
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
            {adminUser == "user" ? (
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
                      <SentimentVerySatisfiedOutlinedIcon />
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
            ) : (
              <Box className="fading">
                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                  size={"large"}
                  style={{ textTransform: "none" }}
                  startIcon={
                    location.pathname.substring(1) == "stats" ? (
                      <AssessmentRoundedIcon />
                    ) : (
                      <BarChartRoundedIcon />
                    )
                  }
                  component={Link}
                  to="/stats"
                >
                  Статистика
                </Button>
                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                  size={"large"}
                  style={{ textTransform: "none" }}
                  startIcon={
                    location.pathname.substring(1) == "places" ? (
                      <StorefrontRoundedIcon />
                    ) : (
                      <StorefrontOutlinedIcon />
                    )
                  }
                  component={Link}
                  to="/places"
                >
                  Места
                </Button>
                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                  size={"large"}
                  style={{ textTransform: "none" }}
                  startIcon={
                    location.pathname.substring(1) == "comments" ? (
                      <ChatBubbleRoundedIcon />
                    ) : (
                      <ChatBubbleOutlineRoundedIcon />
                    )
                  }
                  component={Link}
                  to="/comments"
                >
                  Коментари
                </Button>
                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                  size={"large"}
                  style={{ textTransform: "none" }}
                  startIcon={
                    location.pathname.substring(1) == "users" ? (
                      <PeopleAltRoundedIcon />
                    ) : (
                      <PeopleOutlineRoundedIcon />
                    )
                  }
                  component={Link}
                  to="/users"
                >
                  Потребители
                </Button>
                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                  size={"large"}
                  style={{ textTransform: "none" }}
                  startIcon={
                    location.pathname.substring(1) == "reports" ? (
                      <FlagRoundedIcon />
                    ) : (
                      <FlagOutlinedIcon />
                    )
                  }
                  component={Link}
                  to="/reports"
                >
                  Нередности
                </Button>
              </Box>
            )}

            {isAdmin() && (
              <ToggleButtonGroup
                value={adminUser}
                exclusive
                onChange={(e, b) => b !== null && setAdminUser(b)}
                aria-label="text alignment"
              >
                <ToggleButton value="user" aria-label="Потребителски преглед">
                  <AccountCircleIcon />
                </ToggleButton>
                <ToggleButton
                  value="admin"
                  aria-label="Администраторски преглед"
                >
                  <AdminPanelSettingsIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          </Toolbar>
        </AppBar>
      </div>
    </div>
  );
};

export default TopBar;
