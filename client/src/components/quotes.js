import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import quotes from "./widgets/quotes.json";
import React from "react";
const Quotes = (props) => {
  const [text, setText] = React.useState(
    `Българио, за тебе те умряха, една бе ти достойна зарад тях, и те за теб достойни, майко, бяха И твойто име само кат мълвяха, умираха без страх.`
  );
  const [author, setAuthor] = React.useState("Иван Вазов");
  const [source, setSource] = React.useState("");

  React.useEffect(async () => {
    let el = Math.floor(Math.random() * quotes.length);
    try {
      if (quotes[el].hasOwnProperty("quote")) {
        setText(quotes[el].quote);
      }
      if (quotes[el].hasOwnProperty("author")) {
        setAuthor(quotes[el].author);
      }
      if (quotes[el].hasOwnProperty("source")) {
        setSource(quotes[el].source);
      }
    } catch (err) {
      await props.setAvailable([]);
    }
  }, []);

  return (
    <Box style={{ display: !text && "none" }} className="quoteBox">
      <Typography
        className="quoteText"
        style={{
          fontSize:
            window.innerWidth < window.innerHeight ? "2.5vmax" : "1.2vmax",
          marginBottom: "1vmax",
          color: "white",
        }}
      >
        {text}
      </Typography>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          style={{
            fontSize:
              window.innerWidth < window.innerHeight ? "1.5vmax" : "0.8vmax",
            color: "#808080",
            display: "flex",
            alignItems: "center",
          }}
        >
          {source}
        </Typography>
        {author && (
          <Typography
            style={{
              fontSize:
                window.innerWidth < window.innerHeight ? "2vmax" : "0.8vmax",
              color: "#D3D3D3",
              textAlign: "right",
              width: "70%",
            }}
          >
            - {author}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
export default Quotes;
