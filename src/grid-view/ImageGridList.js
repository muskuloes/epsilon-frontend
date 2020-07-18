import React from "react";
import { Link } from "react-router-dom";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import GridListTile from "@material-ui/core/GridListTile";
import GridList from "@material-ui/core/GridList";
import Dropzone from "./Dropzone";

const useStyles = makeStyles((theme) => ({
  gridList: {
    width: 600,
    position: "absolute",
    top: 60,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      height: "100%",
    },
  },
}));

function ImageGridList(props) {
  const classes = useStyles();
  let gridListTiles = [
    props.imageData.map((image) => (
      <GridListTile key={image.id} cols={1}>
        <Link to={`/detail/${image.name}`}>
          <img
            src={image.urls.small}
            alt={image.alt_description}
            width="100%"
          />
        </Link>
      </GridListTile>
    )),
  ];
  if (!props.search) {
    gridListTiles = [
      <GridListTile key={"+"} cols={1}>
        <Dropzone />
      </GridListTile>,
      ...gridListTiles,
    ];
  }
  return (
    <Container className={classes.gridList} maxWidth="sm">
      <GridList cellHeight={160} cols={3} spacing={5}>
        {gridListTiles}
      </GridList>
    </Container>
  );
}
export default ImageGridList;
