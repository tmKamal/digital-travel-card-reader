import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Box, Typography } from "@material-ui/core";
import MenuBtn from "../components/ui-elements/menu-btn";
import { Link } from "react-router-dom";

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

const MainMenu = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box my={4} mx={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center" component="h1" gutterBottom>
              Ticket Scanner v.01
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MenuBtn url={"/logout"} name="PAYMENTS"></MenuBtn>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MenuBtn url={"/journey-history"} name="JOURNEYS"></MenuBtn>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};
export default MainMenu;
