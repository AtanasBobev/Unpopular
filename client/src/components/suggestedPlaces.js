import React from "react";
import Box from "@material-ui/core/Box";
import SuggestedPlacesElement from "./suggestedPlacesElement";
import { toast } from "react-toastify";

import axios from "axios";
const SuggestedPlaces = () => {
  const [data, setData] = React.useState([]);
  React.useLayoutEffect(() => {
    axios
      .get("https://unpopular-backend.herokuapp.com/place/suggested", {
        headers: { jwt: localStorage.getItem("jwt") },
      })
      .then((data) => {
        setData(data.data);
      })
      .catch((err) => {
        console.error("failed to get data");
      });
  }, []);
  const deleteMe = (id) => {
    setData((prev) => prev.filter((el) => el.id !== id));
  };
  return (
    <Box>
      {data.length ? (
        data.map((el) => (
          <SuggestedPlacesElement
            toast={toast}
            deleteMe={deleteMe}
            suggestions_id={el.id}
            place_id={el.place_id}
            title={el.title}
            suggested_places_title={el.suggested_places_title}
            description={el.description}
            suggested_places_description={el.suggested_places_description}
            placelocation={el.placelocation}
            suggested_places_placelocation={el.suggested_places_placelocation}
            suggested_places_category={el.suggested_places_category}
            category={el.category}
            price={el.price}
            suggested_places_price={el.suggested_places_price}
            accessibility={el.suggested_places_accessibility}
            city={el.city}
            suggested_places_city={el.suggested_places_city}
            dangerous={el.dangerous}
            suggested_places_dangerous={el.suggested_places_dangerous}
            suggested_user_id={el.suggested_user_id}
          />
        ))
      ) : (
        <center>
          Ако някой предложи редакция на някое от качените от Вас места, тя ще
          се появи тук и ще можете да я одобрите или откажете.
        </center>
      )}
    </Box>
  );
};
export default SuggestedPlaces;
