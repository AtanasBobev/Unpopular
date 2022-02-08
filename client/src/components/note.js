import React from "react";
import RichTextEditor from "react-rte";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import { toast } from "react-toastify";
import axios from "axios";
export default function Text(props) {
  const [value, setValue] = React.useState(RichTextEditor.createEmptyValue());
  const [sentValue, setSentValue] = React.useState(
    RichTextEditor.createEmptyValue()
  );
  React.useLayoutEffect(() => {
    if (localStorage.getItem("jwt")) {
      axios
        .request({
          method: "POST",
          url: "https://unpopular-backend.herokuapp.com/noteData",
          headers: {
            jwt: localStorage.getItem("jwt"),
          },
          data: {
            place_id: props.place_id,
          },
        })
        .then((data) => {
          setValue(
            data.data.length
              ? RichTextEditor.createValueFromString(data.data[0].note, "html")
              : RichTextEditor.createEmptyValue()
          );
          setSentValue(
            data.data.length
              ? RichTextEditor.createValueFromString(data.data[0].note, "html")
              : RichTextEditor.createEmptyValue()
          );
        });
    }
  }, []);
  const deleteNote = () => {
    axios
      .delete("https://unpopular-backend.herokuapp.com/note", {
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
        data: {
          place_id: props.place_id,
        },
      })
      .then(() => {
        toast("Бележката е изтрита", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        if (typeof props.setData == "function") {
          props.setData((prev) =>
            prev.filter((el) => el.place_id !== props.place_id)
          );
        }
        setValue(RichTextEditor.createEmptyValue());
      })
      .catch((err) => {
        toast.error("Имаше проблем при изтриването на бележката", {
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
  const saveValue = () => {
    if (value.toString("markdown") == sentValue.toString("markdown")) {
      toast.warn("Няма съдържание за изпращане", {
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
    if (value.toString("markdown").length > 5000) {
      toast.warn("Не може текстът да е над 5000 символа", {
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
    if (value.toString("markdown").length == 2) {
      toast.warn(
        "Бележката изглежда доста кратка. Ако искате да я изтриете настиснете бутона Изтрий",
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
      return false;
    }
    axios
      .request({
        method: "POST",
        url: `https://unpopular-backend.herokuapp.com/note`,
        headers: {
          jwt: localStorage.getItem("jwt"),
        },
        data: {
          value: value.toString("html"),
          place_id: props.place_id,
        },
      })
      .then(() => {
        setSentValue(value);
        toast("Запазено", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        toast.warn("Имаше проблем със запазването", {
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
    <Box className="bcg" style={{ marginTop: "1vmax" }}>
      <center>
        <Typography style={{ margin: "0.5vmax" }} variant="h5">
          Бележка
        </Typography>
        {props.title && (
          <Link
            target="_blank"
            href={`https://unpopular-bulgaria.com/place/${window.btoa(
              props.place_id
            )}`}
          >
            {props.title}
          </Link>
        )}
      </center>
      <Box style={{ marginTop: "1vmax" }}>
        <RichTextEditor
          placeholder={
            localStorage.getItem("jwt")
              ? "Може да си водиш записки за мястото"
              : "Регистрирай се, за да запазиш"
          }
          readOnly={!localStorage.getItem("jwt") && false}
          toolbarConfig={{
            display: [
              "INLINE_STYLE_BUTTONS",
              "BLOCK_TYPE_BUTTONS",
              "LINK_BUTTONS",
              "BLOCK_TYPE_DROPDOWN",
              "HISTORY_BUTTONS",
            ],
            INLINE_STYLE_BUTTONS: [
              {
                label: "Удебелен",
                style: "BOLD",
                className: "custom-css-class",
              },
              { label: "Наклонен", style: "ITALIC" },
              { label: "Подчертан", style: "UNDERLINE" },
            ],
            BLOCK_TYPE_DROPDOWN: [
              { label: "Нормален", style: "unstyled" },
              { label: "Голям", style: "header-one" },
              { label: "Среден", style: "header-two" },
              { label: "Малък", style: "header-three" },
            ],
            BLOCK_TYPE_BUTTONS: [
              { label: "Неподреден лист", style: "unordered-list-item" },
              { label: "Подреден лист", style: "ordered-list-item" },
            ],
          }}
          value={value}
          onChange={(e) => setValue(e)}
        />
      </Box>
      <Box
        style={{
          justifyContent: "space-between",
          marginTop: "1vmax",
          display: !localStorage.getItem("jwt") ? "none" : "flex",
        }}
      >
        <Box>
          <Button
            onClick={deleteNote}
            style={{
              textTransform: "none",
              display:
                value.toString("markdown") == sentValue.toString("markdown") &&
                "none",
            }}
          >
            Изтрий бележка
          </Button>
          <Button
            onClick={() => setValue(RichTextEditor.createEmptyValue())}
            style={{
              textTransform: "none",
              display:
                !/[a-z0-9]/i.test(value.toString("markdown").trim()) && "none",
            }}
          >
            Изчисти
          </Button>
        </Box>
        <Button
          onClick={saveValue}
          style={{
            textTransform: "none",
            display:
              value.toString("markdown") == sentValue.toString("markdown") &&
              "none",
          }}
          variant="outlined"
        >
          Запази
        </Button>
      </Box>
    </Box>
  );
}
