import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import moment from "moment";
import jwt_decode from "jwt-decode";

const axios = require("axios");

const Dashboard = () => {
  const [data, setData] = React.useState({});
  const [ips, setIps] = React.useState([]);

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
  React.useEffect(() => {
    if (!isAdmin) {
      toast.error("Грешка при получаването на информация", {
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
    axios
      .get("https://unpopular-backend.herokuapp.com/stats", {
        headers: { jwt: localStorage.getItem("jwt") },
      })
      .then((data) => {
        setData(data.data.data);
        setIps(data.data.ips);
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
  }, []);
  return (
    <Box
      style={{
        padding: "1vmax",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        width: "98%",
      }}
    >
      <Box className="infoPanelElement blueGradient">
        <center>
          <Typography
            style={{
              fontSize:
                window.innerWidth < window.innerHeight ? "4vmax" : "1.2vmax",
            }}
          >
            {data && data["users_count"]}
          </Typography>
        </center>
        <Typography
          style={{
            fontSize:
              window.innerWidth < window.innerHeight ? "4vmax" : "1.2vmax",
          }}
        >
          Регистрирани потребители
        </Typography>
      </Box>

      <Box className="infoPanelElement greenGradient">
        <center>
          <Typography
            style={{
              fontSize:
                window.innerWidth < window.innerHeight ? "4vmax" : "1.2vmax",
            }}
          >
            {data && data["places"]}
          </Typography>
        </center>
        <Typography
          style={{
            fontSize:
              window.innerWidth < window.innerHeight ? "4vmax" : "1.2vmax",
          }}
        >
          Качени места
        </Typography>
      </Box>
      <Box className="infoPanelElement yellowGradient">
        <center>
          <Typography
            style={{
              fontSize:
                window.innerWidth < window.innerHeight ? "4vmax" : "1.2vmax",
            }}
          >
            {data && data["images"]}
          </Typography>
        </center>
        <Typography
          style={{
            fontSize:
              window.innerWidth < window.innerHeight ? "3vmax" : "1.2vmax",
          }}
        >
          Качени снимки
        </Typography>
      </Box>
      <Box className="infoPanelElement pinkGradient">
        <center>
          <Typography
            style={{
              fontSize:
                window.innerWidth < window.innerHeight ? "4vmax" : "1.2vmax",
            }}
          >
            {data && data["comments"]}
          </Typography>
        </center>
        <Typography
          style={{
            fontSize:
              window.innerWidth < window.innerHeight ? "3vmax" : "1.2vmax",
          }}
        >
          Коментари
        </Typography>
      </Box>
      <Box className="infoPanelElement veryGreenGradient">
        <center>
          <Typography
            style={{
              fontSize:
                window.innerWidth < window.innerHeight ? "4vmax" : "1.2vmax",
            }}
          >
            {data && data["replies"]}
          </Typography>
        </center>
        <Typography
          style={{
            fontSize:
              window.innerWidth < window.innerHeight ? "3vmax" : "1.2vmax",
          }}
        >
          Отговори на коментари
        </Typography>
      </Box>
      <Box className="infoPanelElement stellarGradient">
        <center>
          <Typography
            style={{
              fontSize:
                window.innerWidth < window.innerHeight ? "4vmax" : "1.2vmax",
            }}
          >
            {data && data["replies"]}
          </Typography>
        </center>
        <Typography
          style={{
            fontSize:
              window.innerWidth < window.innerHeight ? "3vmax" : "1.2vmax",
          }}
        >
          Харесвания
        </Typography>
      </Box>

      <TableContainer
        style={{ margin: "2vmax", width: "auto" }}
        className="specialTable"
        component={Paper}
      >
        <Table style={{ width: 1200 }} aria-label="Детайлна статистика">
          <TableHead>
            <TableRow>
              <TableCell>Детайлна статистика</TableCell>
              <TableCell align="center">24 часа</TableCell>
              <TableCell align="center">3 дни</TableCell>
              <TableCell align="center">7 дни</TableCell>
              <TableCell align="center">14 дни</TableCell>
              <TableCell align="center">30 дни</TableCell>
              <TableCell align="center">3 месеца</TableCell>
              <TableCell align="center">1 година</TableCell>
              <TableCell align="center">10 години</TableCell>
              <TableCell align="center">Общо</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              key={"Потребители"}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {"Потребители"}
              </TableCell>
              <TableCell align="center">{data["users_last_1day"]}</TableCell>
              <TableCell align="center">{data["users_last_3days"]}</TableCell>
              <TableCell align="center">{data["users_last_7days"]}</TableCell>
              <TableCell align="center">{data["users_last_14days"]}</TableCell>
              <TableCell align="center">{data["users_last_30days"]}</TableCell>
              <TableCell align="center">{data["users_last_3months"]}</TableCell>
              <TableCell align="center">{data["users_last_year"]}</TableCell>
              <TableCell align="center">{data["users_last_10years"]}</TableCell>
              <TableCell align="center">{data["users_count"]}</TableCell>
            </TableRow>
            <TableRow
              key={"Места"}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {"Места"}
              </TableCell>
              <TableCell align="center">{data["place_last_1day"]}</TableCell>
              <TableCell align="center">{data["place_last_3days"]}</TableCell>
              <TableCell align="center">{data["place_last_7days"]}</TableCell>
              <TableCell align="center">{data["place_last_14days"]}</TableCell>
              <TableCell align="center">{data["place_last_30days"]}</TableCell>
              <TableCell align="center">{data["place_last_3months"]}</TableCell>
              <TableCell align="center">{data["place_last_year"]}</TableCell>
              <TableCell align="center">{data["place_last_10year"]}</TableCell>
              <TableCell align="center">{data["places"]}</TableCell>
            </TableRow>
            <TableRow
              key={"Снимки"}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {"Снимки"}
              </TableCell>
              <TableCell align="center">{data["images_last_1day"]}</TableCell>
              <TableCell align="center">{data["images_last_3days"]}</TableCell>
              <TableCell align="center">{data["images_last_7days"]}</TableCell>
              <TableCell align="center">{data["images_last_14days"]}</TableCell>
              <TableCell align="center">{data["images_last_30days"]}</TableCell>
              <TableCell align="center">
                {data["images_last_3months"]}
              </TableCell>
              <TableCell align="center">{data["images_last_year"]}</TableCell>
              <TableCell align="center">{data["images_last_10year"]}</TableCell>
              <TableCell align="center">{data["images"]}</TableCell>
            </TableRow>
            <TableRow
              key={"Коментари"}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {"Коментари"}
              </TableCell>
              <TableCell align="center">{data["comments_last_1day"]}</TableCell>
              <TableCell align="center">
                {data["comments_last_3days"]}
              </TableCell>
              <TableCell align="center">
                {data["comments_last_7days"]}
              </TableCell>
              <TableCell align="center">
                {data["comments_last_14days"]}
              </TableCell>
              <TableCell align="center">
                {data["comments_last_30days"]}
              </TableCell>
              <TableCell align="center">
                {data["comments_last_3months"]}
              </TableCell>
              <TableCell align="center">{data["comments_last_year"]}</TableCell>
              <TableCell align="center">
                {data["comments_last_10year"]}
              </TableCell>
              <TableCell align="center">{data["comments"]}</TableCell>
            </TableRow>

            <TableRow
              key={"Отговори"}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {"Отговори"}
              </TableCell>
              <TableCell align="center">{data["comments_last_1day"]}</TableCell>
              <TableCell align="center">
                {data["comments_replies_last_3days"]}
              </TableCell>
              <TableCell align="center">
                {data["comments_replies_last_7days"]}
              </TableCell>
              <TableCell align="center">
                {data["comments_replies_last_14days"]}
              </TableCell>
              <TableCell align="center">
                {data["comments_replies_last_30days"]}
              </TableCell>
              <TableCell align="center">
                {data["comments_replies_last_3months"]}
              </TableCell>
              <TableCell align="center">
                {data["comments_replies_last_year"]}
              </TableCell>
              <TableCell align="center">
                {data["comments_replies_last_10year"]}
              </TableCell>
              <TableCell align="center">{data["comments_replies"]}</TableCell>
            </TableRow>

            <TableRow
              key={"Харесвания"}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {"Харесвания"}
              </TableCell>
              <TableCell align="center">
                {data["favoriteplaces_last_1day"]}
              </TableCell>
              <TableCell align="center">
                {data["favoriteplaces_last_3days"]}
              </TableCell>
              <TableCell align="center">
                {data["favoriteplaces_last_7days"]}
              </TableCell>
              <TableCell align="center">
                {data["favoriteplaces_last_14days"]}
              </TableCell>
              <TableCell align="center">
                {data["favoriteplaces_last_30days"]}
              </TableCell>
              <TableCell align="center">
                {data["favoriteplaces_last_3months"]}
              </TableCell>
              <TableCell align="center">
                {data["favoriteplaces_last_year"]}
              </TableCell>
              <TableCell align="center">
                {data["favoriteplaces_last_10year"]}
              </TableCell>
              <TableCell align="center">{data["favoriteplaces"]}</TableCell>
            </TableRow>
            <TableRow
              key={"Запазвания"}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {"Запазвания"}
              </TableCell>
              <TableCell align="center">{data["comments_last_1day"]}</TableCell>
              <TableCell align="center">
                {data["savedplaces_last_3days"]}
              </TableCell>
              <TableCell align="center">
                {data["savedplaces_last_7days"]}
              </TableCell>
              <TableCell align="center">
                {data["savedplaces_last_14days"]}
              </TableCell>
              <TableCell align="center">
                {data["savedplaces_last_30days"]}
              </TableCell>
              <TableCell align="center">
                {data["savedplaces_last_3months"]}
              </TableCell>
              <TableCell align="center">
                {data["savedplaces_last_year"]}
              </TableCell>
              <TableCell align="center">
                {data["savedplaces_last_10year"]}
              </TableCell>
              <TableCell align="center">{data["saves"]}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box style={{ flexBasis: "100%" }}></Box>
      <Box className="infoPanelElement defaultContainer">
        <center>
          <Typography
            style={{
              fontSize:
                window.innerWidth < window.innerHeight ? "4vmax" : "1.2vmax",
            }}
          >
            {data && data["active_reports"]}
          </Typography>
        </center>
        <Typography
          style={{
            fontSize:
              window.innerWidth < window.innerHeight ? "3vmax" : "1.2vmax",
          }}
        >
          Активни нередности
        </Typography>
      </Box>
      <Box className="infoPanelElement defaultContainer">
        <center>
          <Typography
            style={{
              fontSize:
                window.innerWidth < window.innerHeight ? "4vmax" : "1.2vmax",
            }}
          >
            {data && data["users_unverified"]}
          </Typography>
        </center>
        <Typography
          style={{
            fontSize:
              window.innerWidth < window.innerHeight ? "3vmax" : "1.2vmax",
          }}
        >
          Непотвърдени профили
        </Typography>
      </Box>
      <Box className="infoPanelElement defaultContainer">
        <center>
          <Typography
            style={{
              fontSize:
                window.innerWidth < window.innerHeight ? "4vmax" : "1.2vmax",
            }}
          >
            {data && data["locked_accounts"]}
          </Typography>
        </center>
        <Typography
          style={{
            fontSize:
              window.innerWidth < window.innerHeight ? "3vmax" : "1.2vmax",
          }}
        >
          Заключени профили
        </Typography>
      </Box>
      <Box className="infoPanelElement defaultContainer">
        <center>
          <Typography
            style={{
              fontSize:
                window.innerWidth < window.innerHeight ? "4vmax" : "1.2vmax",
            }}
          >
            {data && data["active_verification_actons"]}
          </Typography>
        </center>
        <Typography
          style={{
            fontSize:
              window.innerWidth < window.innerHeight ? "3vmax" : "1.2vmax",
          }}
        >
          Активни действия по профили
        </Typography>
      </Box>
      <Box className="infoPanelElement defaultContainer">
        <center>
          <Typography
            style={{
              fontSize:
                window.innerWidth < window.innerHeight ? "4vmax" : "1.2vmax",
            }}
          >
            {data && data["users_admins"]}
          </Typography>
        </center>
        <Typography
          style={{
            fontSize:
              window.innerWidth < window.innerHeight ? "3vmax" : "1.2vmax",
          }}
        >
          Администраторски профила
        </Typography>
      </Box>
      <TableContainer
        style={{ margin: "2vmax", width: "auto" }}
        className="specialTable"
        component={Paper}
      >
        <Table style={{ width: 1200 }} aria-label="Детайлна статистика">
          <TableHead>
            <TableRow>
              <TableCell>Активност на невалидни влизания</TableCell>
              <TableCell align="center">IP-адрес</TableCell>
              <TableCell align="center">Дата</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ips.map((el) => (
              <TableRow
                key={el.user}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {el.user}
                </TableCell>
                <TableCell align="center">{el.ip}</TableCell>
                <TableCell align="center">
                  {moment(el.time).locale("bg").format("LL")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default Dashboard;
