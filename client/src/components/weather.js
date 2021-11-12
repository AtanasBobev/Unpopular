import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Tilt from "react-parallax-tilt";
import moment from "moment";
import "moment/locale/bg";
const Weather = (props) => {
  const formatMiliseconds = (milisecond) => {
    let date = new Date(milisecond * 1000);
    let timestr = date.toLocaleTimeString();
    return moment(timestr, ["h:mm:ss A"]).format("HH:mm");
  };
  return (
    <Box className="weatherWrapper">
      <center>
        <Typography
          variant="h5"
          style={{ margin: "1vmax", fontWeight: "bold" }}
        >
          Времето
        </Typography>
      </center>
      <Box className="mainWeatherWrapper">
        <Box>
          <Typography>
            {"Сега: " +
              Math.round(JSON.stringify(props.data.current.temp)) +
              " °C"}
          </Typography>
        </Box>
        <Box>
          <Typography>
            {"Усеща се: " +
              Math.round(JSON.stringify(props.data.current.feels_like)) +
              " °C"}
          </Typography>
        </Box>
        <Box>
          <Typography>
            Изгрев:{" "}
            {formatMiliseconds(JSON.stringify(props.data.current.sunrise))}
          </Typography>
        </Box>
        <Box>
          <Typography>
            Залез:{" "}
            {formatMiliseconds(JSON.stringify(props.data.current.sunset))}
          </Typography>
        </Box>
        <Box>
          <Typography>
            Влажност: {JSON.stringify(props.data.current.humidity)}%
          </Typography>
        </Box>
        <Box>
          <Typography>
            UV индекс: {Math.round(JSON.stringify(props.data.current.uvi))}
          </Typography>
        </Box>
        <Box>
          <Typography>
            Налягане: {JSON.stringify(props.data.current.pressure)} hPa
          </Typography>
        </Box>
      </Box>
      <Box className="daily">
        {props.data.daily.map((el) => (
          <Tilt>
            <Box className="day">
              <Typography className="dayTitle">
                {moment(Number(el.dt) * 1000)
                  .locale("bg")
                  .format("LL")}
              </Typography>
              <Typography>Ден: {Math.round(el.temp.day)} °C</Typography>
              <Typography>
                Усеща се ден: {Math.round(el.feels_like.day)} °C
              </Typography>
              <Typography>Нощ: {Math.round(el.temp.night)} °C</Typography>
              <Typography>
                Усеща се нощ: {Math.round(el.feels_like.night)} °C
              </Typography>
              <Typography>Минимална: {Math.round(el.temp.min)} °C</Typography>
              <Typography>Максимална: {Math.round(el.temp.max)} °C</Typography>
              <Typography>Влажност: {Math.round(el.humidity)}%</Typography>
              {el.rain && (
                <Typography>Валежност: {Math.round(el.rain * 10)}%</Typography>
              )}
              <Typography>Налягане: {Math.round(el.pressure)} hPa</Typography>
              <Typography>Вятър: {Math.round(el.wind_speed)} м/с</Typography>
              <Typography>Пориви: {Math.round(el.wind_gust)} м/с</Typography>
              <Typography>UV-индекс: {Math.round(el.uvi)}</Typography>
            </Box>
          </Tilt>
        ))}
      </Box>
    </Box>
  );
};
export default Weather;
