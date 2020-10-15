import {
  Box,
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import QrReader from "react-qr-reader";
import WelcomeCard from "../components/welcomeCard";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const QrScanner = () => {
  const classes = useStyles();
  const [qrResult, setQrResult] = useState("No result yet");
  const handleScan = (data) => {
    if (data) {
      setQrResult(data);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };

  return (
    <Container maxWidth="xl">
      <Box my={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center" component="h1" gutterBottom>
              Ticket Scanner v.01
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <React.Fragment>
              <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: "90%" }}
              />
              <p>{qrResult}</p>
            </React.Fragment>
          </Grid>
          <Grid item xs={12} sm={6}>
            <WelcomeCard></WelcomeCard>
            <Paper className={classes.paper}>xs=12 sm=6</Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default QrScanner;
