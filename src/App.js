import React from "react";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { withStyles, fade } from "@material-ui/core/styles";
import GridListTile from "@material-ui/core/GridListTile";
import GridList from "@material-ui/core/GridList";
import socketIOClient from "socket.io-client";
import Dropzone from "./Dropzone";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
    position: "absolute",
    // display: "flex",
    top: 60,
  },
  search: {
    position: "absolute",
    display: "flex",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
    border: "solid",
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
});

class ImageGridList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageData: [],
      query: "",
      originalData: [],
    };
  }

  handleInputChange = (event) => {
    const query = event.target.value;
    if (query.length === 0) {
      this.setState((prevState) => ({
        imageData: prevState.originalData,
        query: query,
      }));
    } else {
      this.setState((prevState) => ({
        imageData: prevState.originalData
          .sort(() => 0.5 * Math.random()) // shuffle the array of images
          .slice(0, Math.random() * 29), // 29 is the original size of the data
        query: query,
      }));
    }
  };

  // TODO: Fetch data from our own API
  // fetchData = async () => {
  // let response = await fetch(
  // `https://api.unsplash.com/photos/random?client_id=${process.env.REACT_APP_CLIENT_ID}&count=29&query=clothing,fashion,people`
  // );
  // if (response.ok) {
  // let data = await response.json();
  // this.setState({
  // imageData: data,
  // query: "",
  // originalData: data,
  // });
  // } else {
  // console.log(response);
  // }
  // };

  componentDidMount = () => {
    // this.fetchData();
    const socket = socketIOClient(process.env.REACT_APP_API_ENDPOINT);
    socket.on("updated files", (data) => {
      // TODO: The api would return data with all images attributes. The code below is just for testing purposes
      const images = data.map((image) => ({
        id: Math.random() * 1000 + 1,
        alt_description: "flask imagaes",
        urls: {
          small: `${process.env.REACT_APP_API_ENDPOINT}/upload/${image}`,
        },
      }));
      this.setState((prevState) => ({
        imageData: [...images, ...prevState.imageData],
        originalData: [...images, ...prevState.originalData],
      }));
    });
  };

  render() {
    const { classes } = this.props;
    const gridListTiles = [
      <GridListTile key={"+"} cols={1}>
        <Dropzone />
      </GridListTile>,
      this.state.imageData.map((image) => (
        <GridListTile key={image.id} cols={image.cols || 1}>
          <img src={image.urls.small} alt={image.alt_description} />
        </GridListTile>
      )),
    ];
    return (
      <div className={classes.root}>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
            value={this.state.query}
            onChange={this.handleInputChange}
          />
        </div>
        <div className={classes.gridList}>
          <GridList cellHeight={160} cols={3}>
            {gridListTiles}
          </GridList>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(ImageGridList);
