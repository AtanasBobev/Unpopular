import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import FacebookIcon from "@material-ui/icons/Facebook";
import IconButton from "@material-ui/core/IconButton";
import GetAppIcon from "@material-ui/icons/GetApp";
import TwitterIcon from "@material-ui/icons/Twitter";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import LinkIcon from "@material-ui/icons/Link";
import DescriptionIcon from "@material-ui/icons/Description";
import { getFacebookUrl } from "@phntms/react-share";
import { getTwitterUrl } from "@phntms/react-share";
import { getWhatsAppUrl } from "@phntms/react-share";
import { getCurrentUrlAndCopyToClipboard } from "@phntms/react-share";
var QRCode = require("qrcode.react");
const axios = require("axios");
const Share = (props) => {
  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-gen");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${props.item_id}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  return (
    <Box>
      <center>
        <QRCode
          id="qr-gen"
          value={`https://www.localhost:3000/place/${props.item_id}`}
          size={200}
          level={"H"}
          includeMargin={false}
        />
        <Typography>https://localhost:3000/place/{props.item_id}</Typography>
        <Box style={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton onClick={downloadQRCode} children={<GetAppIcon />} />
          <IconButton
            onClick={() => {
              try {
                navigator.clipboard.writeText(
                  `localhost:3000/place/${props.item_id}`
                );
                props.toast("Линкът е копиран в клипборда", {
                  position: "bottom-left",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              } catch (err) {
                props.toast.error(
                  "Не успяхме да копираме линка в клиборда, бразурът не позволи. Копирайте го ръчно",
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
              }
            }}
            children={<LinkIcon />}
          />
          <IconButton
            onClick={() => {
              axios
                .request({
                  url: `http://localhost:5000/place/data/${props.item_id}`,
                  method: "GET",
                  responseType: "blob",
                })
                .then((response) => {
                  const url = window.URL.createObjectURL(
                    new Blob([response.data])
                  );
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute(
                    "download",
                    `${props.item_id}_Unpopular.json`
                  );
                  document.body.appendChild(link);
                  link.click();
                  props.toast("Изтяглянето се стартира", {
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
                  console.log(err);
                });
            }}
            children={<DescriptionIcon />}
          />
          <IconButton
            href={getFacebookUrl({
              url: `https://www.localhost:3000/place/${props.item_id}`,
              quote: `Запознай се с ${props.name}`,
              hashtag: "Неизвестно",
            })}
            children={<FacebookIcon />}
          />
          <IconButton
            href={getTwitterUrl({
              url: `https://www.localhost:3000/place/${props.item_id}`,
              text: `Запознай се с ${props.name}`,
              hashtags: "Неизвестно",
            })}
            children={<TwitterIcon />}
          />
          <IconButton
            href={getWhatsAppUrl({
              url: `https://www.localhost:3000/place/${props.item_id}`,
              text: `Запознай се с ${props.name}`,
            })}
            children={<WhatsAppIcon />}
          />
        </Box>
      </center>
    </Box>
  );
};
export default Share;
