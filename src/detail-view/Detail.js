import React from "react";
import { Link, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
  image: {
    borderRadius: theme.shape.borderRadius,
    maxHeight: 700,
  },
  list: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 700,
  },
  listSection: {
    backgroundColor: "inherit",
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0,
  },
}));

function Detail() {
  let { id } = useParams();
  const classes = useStyles();
  return (
    <div classes={classes.root}>
      <Link to="/">
        <Button
          variant="outlined"
          className={classes.button}
          startIcon={<ArrowBackIcon />}
        >
          back
        </Button>
      </Link>
      <Grid container spacing={10}>
        <Grid item xs={12} sm={8}>
          <img
            src={`${process.env.REACT_APP_API_ENDPOINT}/upload/${id}`}
            alt="custom description"
            className={classes.image}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <List className={classes.list} subheader={<li />}>
            {[0, 1, 2, 3, 4].map((sectionId) => (
              <li key={`section-${sectionId}`} className={classes.listSection}>
                <ul className={classes.ul}>
                  <ListSubheader>{`Classes ${sectionId}`}</ListSubheader>
                  {[0, 1, 2].map((item) => (
                    <ListItem key={`attribute-${sectionId}-${item}`}>
                      <ListItemText primary={`Attribute ${item}`} />
                    </ListItem>
                  ))}
                </ul>
              </li>
            ))}
          </List>
        </Grid>
      </Grid>
    </div>
  );
}

export default Detail;
