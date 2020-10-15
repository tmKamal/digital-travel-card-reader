import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import QrImage from "../assets/images/qr-code.jpg";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  media: {
    height: 140,
  },
});

const WelcomeCard = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={QrImage}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Please scan your smart card here!!
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Place your smart card qr code infront of the camera. you could see
            the camerea preview on the left side on the screen.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
export default WelcomeCard;
