import React from "react";
import Box from "@material-ui/core/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import axios from "axios";

const Element = (props) => {
  const [expanded, setExpanded] = React.useState(false);
  const category = (num) => {
    switch (Number(num)) {
      case 1:
        return "Сграда";
        break;
      case 2:
        return "Гледка";
        break;
      case 3:
        return "Екотуризъм";
        break;
      case 4:
        return "Изкуство";
        break;
      case 5:
        return "Заведение";
        break;
      case 6:
        return "Друго";
        break;
      default:
        return "Без категория";
    }
  };
  const dangerous = (num) => {
    switch (Number(num)) {
      case 1:
        return "Не е опасно";
        break;
      case 2:
        return "Малко опасно";
        break;
      case 3:
        return "Средно опасно";
        break;
      case 4:
        return "Много опасно";
        break;
      default:
        return "Без дефиниция";
    }
  };
  const price = (num) => {
    switch (Number(num)) {
      case 2:
        return "Ниска";
        break;
      case 3:
        return "Нормална";
        break;
      case 4:
        return "Висока";
        break;
      default:
        return "Без определение";
    }
  };
  const accessibility = (num) => {
    switch (Number(num)) {
      case 2:
        return "Достъп с инвалидни колички";
        break;
      case 3:
        return "Леснодостъпно";
        break;
      case 4:
        return "Средно трудно";
        break;
      case 5:
        return "Труднодостъпно";
        break;
      default:
        return "Без определение";
    }
  };

  const rejectPlace = () => {
    axios
      .delete(
        "https://unpopular-backend.herokuapp.com/place/suggested/rejected",
        {
          headers: { jwt: localStorage.getItem("jwt") },
          data: {
            suggestions_id: props.suggestions_id,
          },
        }
      )
      .then(() => {
        props.toast("Предложението е изтрито", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        props.deleteMe(props.suggestions_id);
      })
      .catch(() => {
        props.toast.error("Имаше грешка при изтриването на мястото", {
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

  const updatePlace = () => {
    axios
      .post(
        "https://unpopular-backend.herokuapp.com/place/suggested/accepted",
        {
          place_id: props.place_id,
          suggestions_id: props.suggestions_id,
          title: props.title,
          suggested_user_id: props.suggested_user_id,
        },
        { headers: { jwt: localStorage.getItem("jwt") } }
      )
      .then(() => {
        props.deleteMe(props.suggestions_id);
        props.toast("Предложението е прието", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch(() => {
        props.toast.error("Имаше проблем. Пробвайте отново по-късно", {
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
  return (
    <>
      <Box className="suggestedElement">
        <Typography>{props.title}</Typography>
        <IconButton
          children={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={() => setExpanded((prev) => !prev)}
        />
      </Box>
      {expanded && (
        <Box className="suggestedElementOpen">
          <TableContainer component={Paper}>
            <Table aria-label="Таблица с промени">
              <TableHead>
                <TableRow>
                  <TableCell>*</TableCell>
                  <TableCell>Оригинал</TableCell>
                  <TableCell>Промяна</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {props.title !== props.suggested_places_title && (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Заглавие
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {props.title}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {props.suggested_places_title}
                    </TableCell>
                  </TableRow>
                )}
                {props.description !== props.suggested_places_description && (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Описание
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {props.description}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {props.suggested_places_description}
                    </TableCell>
                  </TableRow>
                )}

                {props.placelocation !==
                  props.suggested_places_placelocation && (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Местоположение
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {props.placelocation}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {props.suggested_places_placelocation}
                    </TableCell>
                  </TableRow>
                )}

                {props.category !== props.suggested_places_category && (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Категория
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {category(props.category)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {category(props.suggested_places_category)}
                    </TableCell>
                  </TableRow>
                )}
                {props.prices !== props.suggested_places_prices && (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Цена
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {price(props.price)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {price(props.suggested_places_price)}
                    </TableCell>
                  </TableRow>
                )}

                {props.dangerous !== props.suggested_places_dangerous && (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Опасност
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {price(props.dangerous)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {price(props.suggested_places_dangerous)}
                    </TableCell>
                  </TableRow>
                )}

                {props.dangerous !== props.suggested_places_dangerous && (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      Достъпност
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {accessibility(props.accessibility)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {accessibility(props.suggested_places_accessibility)}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Box className="ButtonHolderSuggestions">
              <Button
                style={{ textTransform: "none" }}
                onClick={rejectPlace}
                variant="outlined"
              >
                Откажи промяната
              </Button>
              <Button
                style={{ textTransform: "none" }}
                onClick={updatePlace}
                variant="contained"
              >
                Приеми промяната
              </Button>
            </Box>
          </TableContainer>
        </Box>
      )}
    </>
  );
};
export default Element;
