import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import successImage from "../assets/images/alert-1.png";
import { Alert } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    maxWidth: "90%",
  },
  marginY: {
    marginTop: "40px",
  },
  marginSmallY:{
    marginTop:"20px"
  }
});

const InfoCard = (props) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Info sign"
          height="200"
          image={successImage}
          title="Info sign"
          className={classes.marginY}
        />
        <CardContent>
          {!props.totalCost && (
            <Typography gutterBottom variant="h5" component="h2">
              Hi {props.name} !!
            </Typography>
          )}
          {props.totalCost && (
            <Typography gutterBottom variant="h5" component="h2">
              Thank You {props.name}
              <br />
            </Typography>
          )}
          <Typography className={classes.marginSmallY} variant="h6" color="textSecondary" component="p">
            {props.info}
          </Typography>
          {props.totalCost && (
            <Alert className={classes.marginY} severity="info">
              Journey Cost — <strong>LKR {props.totalCost}.00</strong>
            </Alert>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
export default InfoCard;
