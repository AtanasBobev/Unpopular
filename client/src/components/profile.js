import React from "react";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import jwt_decode from "jwt-decode";
import ImageIcon from "@material-ui/icons/Image";
import { useHistory } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import PureModal from "react-pure-modal";
import Name from "./changeName";
import Avatar from "./changeAvatar";
import Email from "./changeEmail";
import Password from "./changePassword";
import Delete from "./deleteProfile";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Settings from "@material-ui/icons/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@material-ui/core/IconButton";
import CardComponent from "./card";
const axios = require("axios");

const Profile = (props) => {
  const history = useHistory();
  const [openEmail, setOpenEmail] = React.useState(false);
  const [openAvatar, setOpenAvatar] = React.useState(false);
  const [openDelete, setDelete] = React.useState(false);
  const [openPassword, setOpenPassword] = React.useState(false);
  const [openName, setOpenName] = React.useState(false);
  const [userData, setUserData] = React.useState([]);
  const [viewcount, setViewCount] = React.useState(10);
  const [count, setUserCount] = React.useState("...");
  const [moreVisible, setMoreVisible] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = React.useState();
  const [avatar, setAvatar] = React.useState();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const ID = () => {
    try {
      let a = jwt_decode(localStorage.getItem("jwt"));
      return a.user_id;
    } catch (err) {
      return false;
    }
  };
  const verify = () => {
    try {
      let a = jwt_decode(localStorage.getItem("jwt"));
      return a.Authorized ? true : false;
    } catch (err) {
      return false;
    }
  };
  React.useEffect(() => {
    getUserCards();
  }, []);
  React.useEffect(() => {
    getUserCards(viewcount + 1, 0);
    if (viewcount < count) {
      setMoreVisible(true);
    }
  }, [viewcount]);
  const getUserCards = (limit = 10, offset = 0) => {
    axios
      .request({
        method: "POST",
        url: `http://localhost:5000/userPlaces`,
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
        data: {
          limit: limit,
          offset: offset,
        },
      })
      .then((data) => {
        setAvatar(data.data[0][0].avatar);
        setUserData(data.data);
      })
      .catch((err) => {
        toast.error("Не успяхме да получим данните от сървъра", {
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
  axios
    .get("http://localhost:5000/count", {
      headers: { jwt: localStorage.getItem("jwt") },
    })
    .then((data) => {
      setUserCount(data.data);
    })
    .catch((err) => {
      toast.error("Не успяхме да получим данните от сървъра", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
  const logOut = () => {
    try {
      localStorage.removeItem("jwt");
      history.push("/search");
      toast("Излезнахте от профила си", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      toast.error("Неспецифична грешка", {
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
  };
  const deleteProfile = () => {
    axios
      .request({
        url: "http://localhost:5000/user/delete",
        method: "DELETE",
        headers: { jwt: localStorage.getItem("jwt") },
      })
      .then((data) => {
        localStorage.removeItem("jwt");
        toast("Профилът е изтрит успешно", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        history.push("/search");
      })
      .catch((err) => {
        toast.error("Имаше сървърна грешка. Пробвайте отново по-късно", {
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
  const downloadData = () => {
    axios
      .request({
        url: `http://localhost:5000/user/data/`,
        method: "GET",
        responseType: "blob",
        headers: { jwt: localStorage.getItem("jwt") },
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Data.zip`);
        document.body.appendChild(link);
        link.click();
        props.toast(
          "Изтяглянето се стартира. Имейл с данните е изпратен до Вашия имейл адрес",
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
      })
      .catch((err) => {
        props.toast(
          "Имаше грешка при изтеглянето. Пробвайте отново по-късно ",
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
      <Container style={{ marginTop: "2vmax" }} maxWidth="lg">
        <Typography align="center" variant="h3">
          {jwt_decode(localStorage.getItem("jwt")).Username}
        </Typography>
        <center style={{ margin: "1vmax" }}>
          {" "}
          {(avatar || files) && (
            <img
              style={{ borderRadius: "50%", width: "10vmax", height: "10vmax" }}
              src={
                files
                  ? URL.createObjectURL(files[0])
                  : "http://localhost:5000/image/" + avatar
              }
              alt={"Имаше проблем при зареждането на аватара"}
            />
          )}
        </center>
        <center>
          <IconButton onClick={handleClickOpen} children={<Settings />} />
          <IconButton onClick={logOut} children={<LogoutIcon />} />
        </center>

        <Dialog
          maxWidth="md"
          onClose={handleClose}
          aria-labelledby="MoreInfo"
          open={open}
        >
          <DialogTitle onClose={handleClose}>
            <center>
              <Typography variant="h4">Настройки</Typography>
            </center>
          </DialogTitle>
          <DialogContent
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              style={{ textTransform: "none", margin: "0.5vmax" }}
              variant="outlined"
              onClick={logOut}
            >
              Излез от профила
            </Button>
            <Button
              style={{ textTransform: "none", margin: "0.5vmax" }}
              variant="outlined"
              onClick={() => {
                setOpenAvatar(!openAvatar);
              }}
            >
              Промени аватар
            </Button>
            <PureModal
              header="Промени аватар"
              isOpen={openAvatar}
              closeButton="X"
              closeButtonPosition="top"
              onClose={() => {
                setOpenAvatar(!openAvatar);
                return true;
              }}
            >
              <Avatar
                files={files}
                setFiles={setFiles}
                toast={toast}
                setOpenAvatar={setOpenAvatar}
              />
            </PureModal>
            <PureModal
              header="Промени парола"
              isOpen={openPassword}
              closeButton="X"
              closeButtonPosition="top"
              onClose={() => {
                setOpenPassword(!openPassword);
                return true;
              }}
            >
              <Password toast={toast} setOpenEmail={setOpenEmail} />
            </PureModal>
            <Button
              style={{ textTransform: "none", margin: "0.5vmax" }}
              variant="outlined"
              onClick={() => setOpenPassword(!openPassword)}
            >
              Промени парола
            </Button>
            <Button
              style={{ textTransform: "none", margin: "0.5vmax" }}
              variant="outlined"
              onClick={() => setOpenEmail(!openEmail)}
            >
              Промени имейл
            </Button>
            <PureModal
              header="Промени имейл"
              isOpen={openEmail}
              closeButton="X"
              closeButtonPosition="top"
              onClose={() => {
                setOpenEmail(!openEmail);
                return true;
              }}
            >
              <Email toast={toast} setOpenEmail={setOpenEmail} />
            </PureModal>
            <Button
              style={{ textTransform: "none", margin: "0.5vmax" }}
              variant="outlined"
              onClick={() => setOpenName(!openName)}
            >
              Промени име
            </Button>
            <PureModal
              header="Промени име"
              isOpen={openName}
              closeButton="X"
              closeButtonPosition="top"
              onClose={() => {
                setOpenName(!openName);
                return true;
              }}
            >
              <Name toast={toast} setOpenName={setOpenName} axios={axios} />
            </PureModal>
            <Button
              style={{ textTransform: "none", margin: "0.5vmax" }}
              variant="outlined"
              onClick={() => {
                confirmAlert({
                  title: "Потвърдете",
                  message:
                    "Сигурен ли сте, че искате да запазите данните? Ще Ви изпратим копие по имейл",
                  buttons: [
                    {
                      label: "Да",
                      onClick: () => downloadData(),
                    },
                    {
                      label: "Не",
                    },
                  ],
                });
              }}
            >
              Изтегли всички данни
            </Button>
            <Button
              style={{ textTransform: "none", margin: "0.5vmax" }}
              variant="outlined"
              onClick={() => setDelete(true)}
            >
              Изтрий профил
            </Button>
            <PureModal
              header="Изтрий профил"
              isOpen={openDelete}
              closeButton="X"
              closeButtonPosition="top"
              onClose={() => {
                setDelete(!openDelete);
                return true;
              }}
            >
              <Delete toast={toast} setDelete={setDelete} />
            </PureModal>
          </DialogContent>
        </Dialog>
        <Typography gutterBottom align="center" variant="h5">
          Качени: {count}
        </Typography>
        <Divider />
      </Container>
      <center>
        <FormControl style={{ margin: "1vmax" }} variant="outlined">
          <Select
            defaultValue={10}
            labelId="accessibility-label"
            id="accessibility"
            onChange={(e) => {
              setViewCount(e.target.value);
            }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={999}>Всички</MenuItem>
          </Select>
          <FormHelperText>Брой постове на дисплей</FormHelperText>
        </FormControl>
      </center>
      <Box className="CardContainer">
        {userData !== [] ? (
          userData.map((el) => {
            return (
              <CardComponent
                toast={props.toast}
                key={Math.random()}
                idData={el[0].place_id}
                title={el[0].title}
                description={el[0].description}
                price={el[0].price}
                accessibility={el[0].accessibility}
                category={el[0].category}
                dangerous={el[0].dangerous}
                placelocation={el[0].placelocation}
                likeButtonVisible={verify()}
                reportButtonVisible={true}
                liked={el[0].liked == "true" ? true : false}
                saved={el[0].saved == "true" ? true : false}
                numbersLiked={Number(el[0].likednumber)}
                city={el[0].city}
                mainImg={el[0].url}
                images={el}
                saveButtonVisible={verify()}
                adminRights={el[0].user_id == ID()}
                username={el[0].username}
                avatar={el[0].avatar}
              />
            );
          })
        ) : (
          <Typography variant="h1">Зареждане на данни</Typography>
        )}
      </Box>
      {userData !== [] && moreVisible && userData.length !== 1 ? (
        <Container
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2vmax",
            textTransform: "none",
          }}
          maxWidth="sm"
        >
          <Button
            onClick={() => {
              if (count - viewcount < 10) {
                setViewCount(viewcount + (count - viewcount));
                setMoreVisible(false);
              } else {
                setViewCount(viewcount + 10);
              }
            }}
            variant="outlined"
          >
            Зареди още
          </Button>
        </Container>
      ) : (
        ""
      )}
    </div>
  );
};

export default Profile;
