import {
  Box,
  Container,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import QrReader from "react-qr-reader";
import WelcomeCard from "../components/welcomeCard";
import { useHttpClient } from "../hooks/http-hook";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const QrScanner = () => {
  const classes = useStyles();
  const [qrResult, setQrResult] = useState();
  const [journeyDetails, setJourneyDetails] = useState();
  const { isLoading, sendRequest } = useHttpClient();
  const [location, setLocation] = useState("");
  const busId = "5f8703f32e0d6e428094097f";

  useEffect(() => {
    const requestJourney = async () => {
      let journeyInfo = {
        busId,
        userId: qrResult,
        location,
      };

      try {
        setJourneyDetails(
          await sendRequest(
            `http://localhost:8000/api/journey/stat`,
            "POST",
            JSON.stringify(journeyInfo),
            { "Content-Type": "application/json" }
          )
        );
      } catch (err) {}
    };
    requestJourney();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrResult, sendRequest]);

  const handleScan = async (data) => {
    if (data) {
      setQrResult(data);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };
  // location selecter
  const handleChange = (event) => {
    setLocation(event.target.value);
  };

  return (
    <Container maxWidth="xl">
      <Box my={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center" component="h1" gutterBottom>
              Ticket Scanner v.01
            </Typography>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                Location
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={location}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"kaduwela"}>Kaduwela</MenuItem>
                <MenuItem value={"malabe"}>Malabe</MenuItem>
                <MenuItem value={"koswatta"}>Koswatta</MenuItem>
                <MenuItem value={"battaramulla"}>Battaramulla</MenuItem>
                <MenuItem value={"kotta road"}>Kotta road</MenuItem>
                <MenuItem value={"kollupitiya"}>Kollupitiya</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <React.Fragment>
              {!qrResult && (
                <QrReader
                  delay={300}
                  onError={handleError}
                  onScan={handleScan}
                  style={{ width: "90%" }}
                />
              )}
              {/* let the Journey begins */}
              {qrResult &&
                !isLoading &&
                journeyDetails &&
                journeyDetails.status === "start" && (
                  <div>Put your belt onn!!</div>
                )}
              {/* Kill the Journey and kick out the passenger */}
              {qrResult &&
                !isLoading &&
                journeyDetails &&
                journeyDetails.status === "end" && (
                  <React.Fragment>
                    <div>Have a nice day. Stay Safe!</div>
                    <div>Total Cost : {journeyDetails.journey.cost}</div>
                  </React.Fragment>
                )}
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
