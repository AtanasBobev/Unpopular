import React from "react";
import Box from "@material-ui/core/Box";
import UserCard from "./userPanel";
import Typography from "@material-ui/core/Typography";
import { toast } from "react-toastify";
const axios = require("axios");

const Dashboard = () => {
  const [users, setUsers] = React.useState([]);
  React.useLayoutEffect(() => {
    axios
      .get("https://unpopular-backend.herokuapp.com/users", {
        params: { limit: 999 },
        headers: { jwt: localStorage.getItem("jwt") },
      })
      .then((data) => {
        setUsers(data.data);
      })
      .catch((err) => {
        toast.error(
          "Имаше проблем със сървъра при запитването. Пробвайте отново по-късно!",
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
  }, []);
  const removeMe = (id) => {
    setUsers((el) => el.filter((e) => Number(e.id) !== Number(id)));
  };
  return (
    <Box>
      {users &&
        users.map((el) => {
          return (
            <UserCard
              admin={el.admin}
              locked={el.locked}
              comment_count={Number(el.comments_count)}
              replies_count={Number(el.comments_replies_count)}
              emailsent={el.emailsent}
              upladed_places={el.upladed_places}
              favoriteplaces_count={Number(el.favoriteplaces_count)}
              savedplaces_count={el.savedplaces_count}
              date={el.date}
              email={el.email}
              username={el.username}
              verified={el.verified}
              avatar={el.avatar}
              removeMe={removeMe}
              id={el.id}
            />
          );
        })}
    </Box>
  );
};
export default Dashboard;
