import React, { useState, useEffect } from "react";
import {
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  makeStyles,
  Paper,
  Chip,
} from "@material-ui/core";
import { useHttpClient } from "../../hooks/http-hook";



const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },

  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  table: {
    minWidth: 650,
  },

  marginT: {
    marginTop: "2rem",
  },
}));

const JourneyHistory = () => {
  const classes = useStyles();
  const [loadedJourneys, setLoadedJourneys] = useState();
  const { isLoading, sendRequest } = useHttpClient();

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        setLoadedJourneys(
          await sendRequest(
            `${process.env.REACT_APP_BACKEND_API}/api/journey/get-all`
          )
        );
      } catch (err) {}
    };
    fetchJourneys();
  }, [sendRequest]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography
          variant="h5"
          align="center"
          color="textSecondary"
          paragraph
          className={classes.marginT}
        >
          Journeys
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Bus Name</TableCell>

                <TableCell align="center">User Name</TableCell>
                <TableCell align="center">Start Location</TableCell>
                <TableCell align="center">End Location</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading &&
                loadedJourneys &&
                loadedJourneys.journeys.map((journey) => (
                  <TableRow key={journey._id}>
                    <TableCell component="th" scope="row">
                      {journey.busId.regNo}
                    </TableCell>

                    <TableCell align="center">
                      {journey.passengerId.name}
                    </TableCell>
                    <TableCell align="center">{journey.startPlace}</TableCell>
                    <TableCell align="center">{journey.status===true?"__":journey.endPlace}</TableCell>
                    <TableCell align="center">{journey.status===true?<Chip color="secondary" label="Ongoing" />:<Chip color="primary"
 label="Completed" />}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {!isLoading && loadedJourneys && loadedJourneys.journeys.length === 0 && (
          <React.Fragment>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
              className={classes.marginT}
            >
              0 Journeys
            </Typography>
          </React.Fragment>
        )}
      </Grid>
    </Grid>
  );
};
export default JourneyHistory;
