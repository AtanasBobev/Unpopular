import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

const axios = require("axios");
import UserComplain from "./userComplain";
const Dashboard = () => {
  const [complains, setComplains] = React.useState([]);
  const [complainsFeatured, setComplainsFeatured] = React.useState([]);

  React.useLayoutEffect(() => {
    axios
      .request({
        method: "GET",
        url: "http://localhost:5000/admin/complains",
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
        params: {
          limit: 999,
        },
      })
      .then((data) => {
        if (data.data) {
          setComplains(data.data);
        } else {
          setComplains([]);
        }
      });

    axios
      .request({
        method: "GET",
        url: "http://localhost:5000/admin/featured/complains",
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
        params: {
          limit: 999,
        },
      })
      .then((data) => {
        if (data.data) {
          setComplainsFeatured(data.data);
        } else {
          setComplainsFeatured([]);
        }
      });
  }, []);
  const deleteMe = (id) => {
    setComplainsFeatured((prev) =>
      prev.filter((el) => Number(el.report_id) !== Number(id))
    );
    setComplains((prev) =>
      prev.filter((el) => Number(el.report_id) !== Number(id))
    );
  };
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "space-around",
        width: "100%",
        marginTop: "1vmax",
      }}
    >
      <Box
        style={{
          width: "45vw",
          padding: "1vmax",
          display: "flex",
          flexWrap: "wrap",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <center>
          <Typography variant="h3">Отбелязани доклади</Typography>
        </center>
        {complainsFeatured.map((el) => (
          <UserComplain
            item_id={el.item_id}
            type={el.type}
            date={moment(el.date).format("MMMM Do YYYY, hh:mm:ss")}
            content={el.reason}
            user_id={el.user_id}
            report_id={el.report_id}
            priority={el.priority}
            deleteMe={deleteMe}
          />
        ))}
      </Box>
      <Box
        style={{
          width: "45vw",
          padding: "1vmax",
          display: "flex",
          flexWrap: "wrap",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <center>
          <Typography variant="h3">Всички доклади</Typography>
        </center>

        {complains.map((el) => (
          <UserComplain
            item_id={el.item_id}
            type={el.type}
            date={moment(el.date).format("MMMM Do YYYY, hh:mm:ss")}
            content={el.reason}
            user_id={el.user_id}
            report_id={el.report_id}
            priority={el.priority}
            deleteMe={deleteMe}
          />
        ))}
      </Box>
    </Box>
  );
};
export default Dashboard;
