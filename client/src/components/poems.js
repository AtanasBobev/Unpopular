import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import "react-pure-modal/dist/react-pure-modal.min.css";
import DialogActions from "@material-ui/core/DialogActions";
import poems from "./widgets/poems.json";
import Image from "material-ui-image";

const CardElement = (props) => {
  const [open, setOpen] = React.useState(false);
  const [author, setAuthor] = React.useState("Иван Вазов");
  const [authorData, setAuthorData] = React.useState("Иван Вазов");
  const [text, setText] = React.useState("");
  const [coverText, setCoverText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [image, setImage] = React.useState("../images/widgets/slaveykov.jpeg");

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  React.useEffect(async () => {
    let el = Math.floor(Math.random() * poems.length);
    try {
      setText(poems[el].text);
      setAuthor(poems[el].author);
      setAuthorData(poems[el].authorData);
      setCoverText(poems[el].coverText);
      setTitle(poems[el].title);
      setImage(poems[el].authorImage);
    } catch (err) {}
  }, []);
  return (
    <div>
      <Card className="card specialCard">
        <CardActionArea
          onClick={() => {
            handleClickOpen();
          }}
        >
          <CardContent style={{ fontSize: "1.5vmax" }} className="specialText">
            {coverText.split("\n").map((item, i) => (
              <p key={i}>{item}</p>
            ))}
          </CardContent>
        </CardActionArea>
        <CardActions style={{ display: "flex", justifyContent: "flex-end" }}>
          <p> - {author}</p>
        </CardActions>
      </Card>
      <Dialog
        maxWidth="md"
        onClose={handleClose}
        aria-labelledby="MoreInfo"
        open={open}
      >
        <div className="specialCard">
          <DialogTitle
            style={{ color: "white", textAlign: "center" }}
            id="MoreInfo"
            onClose={handleClose}
          >
            <Typography
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: "900",
                textShadow: "0px 0px 6px rgba(255,255,255,0.7)",
              }}
              variant={window.innerWidth < window.innerHeight ? "h4" : "h3"}
            >
              {title}
            </Typography>
          </DialogTitle>
          <DialogContent
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              alignContent: "stretch",
              flexWrap: window.innerWidth < window.innerHeight && "wrap",
            }}
            className="poemsMain"
          >
            <div
              style={{
                fontSize: "1.5vmax",
                width: window.innerWidth < window.innerHeight ? "100%" : "50%",
                display: "inline-block",
              }}
              className="specialText"
            >
              {text.split("\n").map((item, i) => (
                <p key={i}>{item}</p>
              ))}
            </div>
            <div
              style={{
                fontSize: "1.5vmax",
                width: window.innerWidth < window.innerHeight ? "100%" : "40%",
                marginLeft: "10%",
                display: "inline-block",
              }}
              className="specialText"
            >
              <img
                style={{
                  height: "auto",
                  width: "100%",
                  boxShadow:
                    "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
                  borderRadius: "2%",
                  pointerEvents: "none",
                }}
                src={image}
                gutterBottom
              />
              <Typography
                style={{
                  fontWeight: "bold",
                  fontSize:
                    window.innerWidth < window.innerHeight ? "4vmax" : "2vmax",
                }}
                gutterBottom
              >
                {author}
              </Typography>
              <Typography>{authorData}</Typography>
            </div>
          </DialogContent>

          <DialogActions className="btnCard"></DialogActions>
        </div>
      </Dialog>
    </div>
  );
};
export default CardElement;
