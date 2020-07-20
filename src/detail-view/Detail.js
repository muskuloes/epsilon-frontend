import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ImageMapper from "react-image-mapper";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  button: {
    marginBottom: theme.spacing(1),
    justifyContent: "left",
  },
  image: {
    borderRadius: theme.shape.borderRadius,
    maxHeight: 700,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  list: {
    width: "100%",
    // maxWidth: 200,
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 700,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  listSection: {
    backgroundColor: "inherit",
  },
  loading: {
    justify: "center",
    position: "absolute",
    top: "50%",
    left: "48.5%",
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0,
  },
}));

function Detail() {
  const { id } = useParams();
  const classes = useStyles();
  const [predictions, setPredictions] = useState({
    data: [],
    loading: true,
    map: {},
    all_areas: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      let response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/predictions/${id}`
      );
      if (response.status === 200) {
        let { data } = await response.json();
        let preds = JSON.parse(data)["preds"];
        let classes = preds["class_ids"];
        let bboxes = preds["bbox"];
        let areas = bboxes.map((box, index) => {
          return {
            name: index,
            shape: "rect",
            coords: [box[0], box[1], box[0] + box[2], box[1] + box[3]],
            preFillColor: "rgba(177, 255, 71, 0.5)",
            strokeColor: "#6afd09",
          };
        });
        setPredictions({
          data: classes,
          loading: false,
          map: {
            name: "masks",
            areas: [],
          },
          all_areas: areas,
        });
      }
    };
    fetchData();
  }, [id]);
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
      {predictions.loading ? (
        <div className={classes.loading}>
          <CircularProgress color="secondary" />
        </div>
      ) : (
        <Grid container spacing={10}>
          <>
            <Grid item xs={12} sm={8}>
              <ImageMapper
                src={`${process.env.REACT_APP_API_ENDPOINT}/upload/${id}`}
                map={predictions.map}
                alt="custom description"
                className={classes.image}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <List className={classes.list} subheader={<li />}>
                {predictions.data.map((class_type, index) => (
                  <li key={index} className={classes.listSection}>
                    <ul className={classes.ul}>
                      <ListSubheader>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            setPredictions((prevState) => ({
                              ...prevState,
                              map: {
                                name: "masks",
                                areas: [prevState.all_areas[index]],
                              },
                            }));
                          }}
                        >
                          {class_type}
                        </Button>
                      </ListSubheader>
                    </ul>
                  </li>
                ))}
              </List>
            </Grid>
          </>
        </Grid>
      )}
    </div>
  );
}

export default Detail;
