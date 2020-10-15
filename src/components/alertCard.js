import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

import alertImage from "../assets/images/alert-2.png";
import { Alert, AlertTitle } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    maxWidth: "90%",
  },
  marginY: {
    marginTop: "40px",
  },
  marginSmallY: {
    marginTop: "20px",
  },
});

const AlertCard = (props) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Info sign"
          height="200"
          image={alertImage}
          title="Info sign"
          className={classes.marginY}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            We are sorry !
            <br />
          </Typography>
          <Alert className={classes.marginY} severity="error">
            <AlertTitle>{props.error}</AlertTitle>
          </Alert>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
export default AlertCard;
