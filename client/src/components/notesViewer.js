import React from "react";
import Box from "@material-ui/core/Box";
import { toast } from "react-toastify";
import Note from "./note";
import axios from "axios";
const NotesViewer = () => {
  const [data, setData] = React.useState([]);
  try {
    React.useEffect(() => {
      axios
        .request({
          method: "GET",
          url: "https://unpopular-backend.herokuapp.com/notes",
          headers: {
            jwt: localStorage.getItem("jwt"),
          },
        })
        .then((data) => setData(data.data))
        .catch(() => {
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
    }, []);
  } catch (err) {}
  return (
    <Box>
      {data
        ? data.map((el) => (
            <Note setData={setData} title={el.title} place_id={el.place_id} />
          ))
        : "Изчакайте"}
    </Box>
  );
};
export default NotesViewer;
