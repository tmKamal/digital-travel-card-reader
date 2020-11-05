import {
  Box,
  Card,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect, useContext } from "react";
import QrReader from "react-qr-reader";
import CustomButton from "../components/customBtn";
import InfoCard from "../components/infoCard";
import { useHttpClient } from "../hooks/http-hook";
import useSound from "use-sound";
import successFx from "../assets/sounds/success.mp3";
import alertFx from "../assets/sounds/alert.wav";
import AlertCard from "../components/alertCard";
import { AuthContext } from "../context/auth-context";
import GMapJourney from "../components/gMapJourney";

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
  media: {
    height: 260,
  },
  mapCardWidth: {
    width: "100%",
  },
  mapCardHeight: {
    height: "70%",
  },
}));

const QrScanner = () => {
  const classes = useStyles();
  const [qrResult, setQrResult] = useState();
  const [journeyDetails, setJourneyDetails] = useState();
  const { isLoading, sendRequest, error, errorPopupCloser } = useHttpClient();
  const [location, setLocation] = useState("");
  const [playSuccess] = useSound(successFx);
  const [playAlert] = useSound(alertFx);
  const auth = useContext(AuthContext);
  const [routeArray, setRouteArray] = useState([]);
  useEffect(() => {
    const requestJourney = async () => {
      //console.log("busId: "+auth.regNo);
      //console.log(`busId: ${auth.route.regNo}, route: ${auth.route.route}, busRegNO: ${auth.route.regNo}`)
      if (qrResult && auth) {
        let journeyInfo = {
          busId: auth.route._id,
          userId: qrResult,
          location,
        };
        try {
          setJourneyDetails(
            await sendRequest(
              `${process.env.REACT_APP_BACKEND_API}/api/journey/stat`,
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
  // sound alert
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
  // fetch routes
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BACKEND_API}/api/bus-route/get/${auth.route.route}`
        );
        console.log("here is the rustle");
        console.log(response.route.route);

        setRouteArray(response.route.route);
        setLocation(response.route.route[0])
      } catch (err) {}
    };

    fetchRoutes();
  }, [auth]);

  return (
    <Container maxWidth="xl">
      <Box my={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center" component="h1" gutterBottom>
              Smart Card Scanner v.01
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
                {!isLoading &&
                  routeArray &&
                  routeArray.map((r, id) => (
                    <MenuItem key={id} value={r}>
                      {r.name}
                    </MenuItem>
                  ))}
                {console.log(routeArray)}
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
              {isLoading && <CircularProgress />}
            </React.Fragment>
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* <WelcomeCard></WelcomeCard> */}
            <Card
              elevation={3}
              className={(classes.mapCardWidth, classes.mapCardHeight)}
            >
              {
                auth &&
                routeArray.length &&
                routeArray[1].name && location.latlng&&(
                  <GMapJourney currentPosition={location.latlng} busStops={routeArray}></GMapJourney>
                )}
            </Card>

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
