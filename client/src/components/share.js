import React from "react";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Tooltip from "@mui/material/Tooltip";
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
          value={`https://unpopular-bulgaria.com/place/${window.btoa(
            props.item_id
          )}`}
          size={200}
          level={"H"}
          includeMargin={false}
          style={{ marginBottom: "2vmax" }}
        />
        <Typography>
          <Link
            href={`https://unpopular-bulgaria.com/place/${window.btoa(
              props.item_id
            )}`}
          >
            https://unpopular-bulgaria.com/place/
            {window.btoa(props.item_id)}
          </Link>
        </Typography>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "2vmax",
          }}
        >
          <Tooltip title="Изтегли QR код">
            <IconButton onClick={downloadQRCode} children={<GetAppIcon />} />
          </Tooltip>
          <Tooltip title="Копирай линка в клипборда">
            <IconButton
              onClick={() => {
                try {
                  navigator.clipboard.writeText(
                    `https://www.unpopular-bulgaria.com/place/${window.btoa(
                      props.item_id
                    )}`
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
                    "Не успяхме да копираме линка в клиборда, може би използвате стар браузър. Копирайте го ръчно от по-горе",
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
          </Tooltip>

          <Tooltip title="Изтегли данните на мястото">
            <IconButton
              onClick={() => {
                axios
                  .request({
                    url: `https://unpopular-backend.herokuapp.com/place/data/${props.item_id}`,
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
                    props.toast("Изтеглянето се стартира", {
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
                    console.error(err);
                  });
              }}
              children={<DescriptionIcon />}
            />
          </Tooltip>
          <Tooltip title="Сподели във Фейсбук">
            <IconButton
              href={getFacebookUrl({
                url: `https://www.https://www.unpopular-bulgaria.com/place/${window.btoa(
                  props.item_id
                )}`,
                quote: `Запознай се с ${props.name}`,
                hashtag: "Непопулярно",
              })}
              children={<FacebookIcon />}
            />
          </Tooltip>
          <Tooltip title="Сподели в Туитър">
            <IconButton
              href={getTwitterUrl({
                url: `https://www.https://www.unpopular-bulgaria.com/place/${window.btoa(
                  props.item_id
                )}`,
                text: `Запознай се с ${props.name}`,
                hashtags: "Непопулярно",
              })}
              children={<TwitterIcon />}
            />
          </Tooltip>
        </Box>
      </center>
    </Box>
  );
};
export default Share;
