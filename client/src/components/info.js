import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import axios from "axios";
const Info = () => {
  let [places, setPlaces] = React.useState();
  let [users, setUsers] = React.useState();
  let [images, setImages] = React.useState();
  let [liked, setLiked] = React.useState();
  let [saved, setSaved] = React.useState();
  let [comments, setComments] = React.useState();
  let [replies, setReplies] = React.useState();
  React.useEffect(() => {
    axios.get("http://localhost:5000/stats").then((data) => {
      setPlaces(Number(data.data["places"]));
      setUsers(Number(data.data["users_count"]));
      setImages(Number(data.data["images"]));
      setLiked(Number(data.data["likes"]));
      setSaved(Number(data.data["saves"]));
      setComments(Number(data.data["comments"]));
      setReplies(Number(data.data["replies"]));
    });
  }, []);
  return (
    <>
      <Box className="info">
        <center>
          <img className="meImg" src={require("../images/me.jpg").default} />
        </center>
        <Typography gutterBottom variant="h5">
          Здравей, името ми е Атанас на 17 години от София. Занимавам се от
          няколко години с програмиране и за мен това е начин за свързване на
          хората по-близо отколкото някога са били. Вярвам, че всеки трябва да
          има достъп до платформа където да разказва своята история чрез
          местата, които е посетил. Идеята за проекта дойде миналото лято, след
          като бях на гости при баба ми и не познавах града достатъчно добре, за
          да знам някои интересни и нетолкова комерсиализирани места.{" "}
          <b style={{ color: "gold" }}>Неизвестно</b> се оформи като платформа
          за споделяне на интересни места в различни градове, предлагайки на
          всеки достъп до единна база с данни с места, без ограничения - от
          всеки, за всеки.
        </Typography>
        <Typography gutterBottom variant="h6">
          <center>
            <b>Няколко бързи факта за платформата:</b>
          </center>
          <ul>
            {places && <li>Качени са {places} места</li>}
            {users && <li>Регистрирани са {users} потребители</li>}
            {images && <li>Качени са {images} изображения</li>}
            {liked && <li>Харесани са {liked} места</li>}
            {saved && <li>Запазени са {saved} места</li>}
            {comments && <li>Публикувани са {comments} коментара</li>}
            {replies && <li>На тези коментари има {replies} отговора</li>}
          </ul>
        </Typography>
        <center>
          <Typography gutterBottom variant="h5">
            <b>Помогни на проекта! </b>
          </Typography>
        </center>
        <Typography gutterBottom variant="h6">
          Изчислителната мощ и пространството за съхранение струват пари.
          Подкрепи проекта с дарение на IBAN: 1231257126357
        </Typography>
      </Box>
    </>
  );
};
export default Info;
