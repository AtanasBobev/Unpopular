import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";

import moment from "moment";
import UserComplain from "./userComplain";
import { toast } from "react-toastify";

const axios = require("axios");
const Dashboard = () => {
  const [complains, setComplains] = React.useState([]);
  const [complainsFeatured, setComplainsFeatured] = React.useState([]);
  const [search, setSearch] = React.useState(1);
  const [specialSearch, setSearchSpecial] = React.useState(1);

  React.useEffect(() => {
    fetchFeatured();
  }, [specialSearch]);
  React.useEffect(() => {
    fetchNormal();
  }, [search]);
  React.useLayoutEffect(() => {
    fetchNormal();
    fetchFeatured();
  }, []);

  const fetchFeatured = () => {
    axios
      .request({
        method: "GET",
        url: "https://unpopular-backend.herokuapp.com/admin/featured/complains",
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
        params: {
          order: specialSearch,
          limit: 999,
        },
      })
      .then((data) => {
        if (data.data) {
          setComplainsFeatured(data.data);
        } else {
          setComplainsFeatured([]);
        }
      })
      .catch((err) => {
        toast.error("Грешка при получаването на информация", {
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
  const fetchNormal = () => {
    axios
      .request({
        method: "GET",
        url: "https://unpopular-backend.herokuapp.com/admin/complains",
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
        params: {
          limit: 999,
          order: search,
        },
      })
      .then((data) => {
        if (data.data) {
          setComplains(data.data);
        } else {
          setComplains([]);
        }
      });
  };
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
        flexWrap: window.innerWidth < window.innerHeight && "wrap",
        justifyContent: "space-around",
        width: "100%",
        marginTop: "1vmax",
      }}
    >
      <Box
        style={{
          width: window.innerWidth < window.innerHeight ? "100vw" : "45vw",
          padding: "1vmax",
          display: "flex",
          flexWrap: "wrap",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <center style={{ width: "100%", marginBottom: "1vmax" }}>
          <Typography
            variant={!(window.innerWidth < window.innerHeight) ? "h3" : "h4"}
          >
            Отбелязани доклади
          </Typography>
        </center>
        <center>
          {complainsFeatured.length ? (
            <FormControl variant="outlined">
              <Select
                onChange={(e) => setSearchSpecial(e.target.value)}
                defaultValue={1}
                labelId="category-label"
                id="category"
              >
                <MenuItem value={1}>По подразбиране</MenuItem>
                <MenuItem value={2}>Дата най-нови</MenuItem>
                <MenuItem value={3}>Дата най-стари</MenuItem>
              </Select>
              <FormHelperText>Сортиране</FormHelperText>
            </FormControl>
          ) : (
            ""
          )}
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
          width: window.innerWidth < window.innerHeight ? "100vw" : "45vw",
          padding: "1vmax",
          display: "flex",
          flexWrap: "wrap",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <center style={{ width: "100%", marginBottom: "1vmax" }}>
          <Typography
            variant={!(window.innerWidth < window.innerHeight) ? "h3" : "h4"}
          >
            Непрегледани доклади
          </Typography>
        </center>
        <center>
          {complains.length ? (
            <FormControl variant="outlined">
              <Select
                onChange={(e) => setSearch(e.target.value)}
                defaultValue={1}
                labelId="category-label"
                id="category"
              >
                <MenuItem value={1}>Дата най-скорошни</MenuItem>
                <MenuItem value={2}>Дата най-стари</MenuItem>
              </Select>
              <FormHelperText>Сортиране</FormHelperText>
            </FormControl>
          ) : (
            ""
          )}
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
