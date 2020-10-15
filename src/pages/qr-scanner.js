import {
  Box,
  Container,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import QrReader from "react-qr-reader";
import CustomButton from "../components/customBtn";
import InfoCard from "../components/infoCard";
import WelcomeCard from "../components/welcomeCard";
import { useHttpClient } from "../hooks/http-hook";
import useSound from "use-sound";
import successFx from "../assets/sounds/success.mp3";
import alertFx from "../assets/sounds/alert.wav";
import AlertCard from "../components/alertCard";

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
  marginY: {
    marginTop: "20px",
  },
  media:{
      height:260
  }
}));

const QrScanner = () => {
  const classes = useStyles();
  const [qrResult, setQrResult] = useState();
  const [journeyDetails, setJourneyDetails] = useState();
  const { isLoading, sendRequest, error, errorPopupCloser } = useHttpClient();
  const [location, setLocation] = useState("");
  const busId = "5f8703f32e0d6e428094097f";
  const [playSuccess] = useSound(successFx);
  const [playAlert] = useSound(alertFx);

  useEffect(() => {
    const requestJourney = async () => {
      let journeyInfo = {
        busId,
        userId: qrResult,
        location,
      };
      if (qrResult) {
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
      } else {
        setJourneyDetails(null);
      }
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
  // reset the scanner
  const reloadScanner = () => {
    setJourneyDetails(null);
    setQrResult(null);
    errorPopupCloser();
  };

  useEffect(() => {
    if (qrResult) {
      if (error) {
        playAlert();
        setTimeout(() => {
          playAlert();
        }, 1300);
      } else {
        playSuccess();
      }
    }
  }, [qrResult, error, playSuccess, playAlert]);

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
                  <InfoCard
                    name={journeyDetails.passengerName}
                    info={"Please have a seat!!!"}
                  ></InfoCard>
                )}
              {/* Kill the Journey and kick out the passenger */}
              {qrResult &&
                !isLoading &&
                journeyDetails &&
                journeyDetails.status === "end" && (
                  <React.Fragment>
                    <InfoCard
                      name={journeyDetails.passengerName}
                      totalCost={journeyDetails.journey.cost}
                      info={"we hope you enjoyed the journey."}
                    ></InfoCard>
                  </React.Fragment>
                )}
              {error && <AlertCard error={error}></AlertCard>}
              {/* skelton loading */}
              {isLoading&&<Skeleton animation="wave" variant="rect" className={classes.media} />}
            </React.Fragment>
          </Grid>
          <Grid item xs={12} sm={6}>
            <WelcomeCard></WelcomeCard>

            {qrResult && !isLoading && (
              <CustomButton
                onClick={reloadScanner}
                variant="contained"
                color="primary"
                disableRipple
                className={classes.marginY}
              >
                SCAN ME
              </CustomButton>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default QrScanner;
