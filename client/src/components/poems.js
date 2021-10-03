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
  console.log("Poems");
  React.useEffect(async () => {
    let el = Math.floor(Math.random() * poems.length);
    console.log(poems[el], el);
    if (props.available.length >= poems.length) {
      await props.setAvailable([]);
    } else {
      console.log("props not restarted");
      while (props.available.includes(el)) {
        el = Math.round(Math.random() * poems.length);
      }
    }
    console.log(poems);
    props.setAvailable((available) => [...available, el]);
    setText(poems[el].text);
    setAuthor(poems[el].author);
    setAuthorData(poems[el].authorData);
    setCoverText(poems[el].coverText);
    setTitle(poems[el].title);
    setImage(poems[el].authorImage);
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
              variant="h3"
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
            }}
          >
            <div
              style={{
                fontSize: "1.5vmax",
                width: "50%",
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
                width: "50%",
                width: "40%",
                marginLeft: "10%",
                display: "inline-block",
              }}
              className="specialText"
            >
              <img
                style={{
                  width: "68%",
                  boxShadow:
                    "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
                  borderRadius: "2%",
                }}
                src={image}
              />
              <Typography
                style={{
                  fontWeight: "bold",
                  fontSize: "2vmax",
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
