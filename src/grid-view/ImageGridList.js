import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import GridListTile from "@material-ui/core/GridListTile";
import GridList from "@material-ui/core/GridList";
import Dropzone from "./Dropzone";

const useStyles = makeStyles((theme) => ({
  gridList: {
    width: 500,
    height: 450,
    position: "absolute",
    top: 60,
  },
}));

function ImageGridList(props) {
  const classes = useStyles();
  const gridListTiles = [
    <GridListTile key={"+"} cols={1}>
      <Dropzone />
    </GridListTile>,
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
  return (
    <div className={classes.gridList}>
      <GridList cellHeight={160} cols={3} spacing={5}>
        {gridListTiles}
      </GridList>
    </div>
  );
}
export default ImageGridList;
