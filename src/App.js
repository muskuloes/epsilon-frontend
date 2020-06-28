import React from "react";
import { Switch, Route } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { withStyles, fade } from "@material-ui/core/styles";

import DetailView from "./detail-view/Detail";
import ImageGridListView from "./grid-view/ImageGridList";

import socketIOClient from "socket.io-client";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
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

class App extends React.Component {
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
          .slice(0, Math.random() * 29) // 29 is the original size of the data
          .sort(() => 0.5 * Math.random()), // shuffle the array of images
        query: query,
      }));
    }
  };

  handleData = (data) => {
    const images = data.reverse().map((image) => ({
      id: image.id, // use imageID instead
      alt_description: "flask images",
      urls: {
        small: `${process.env.REACT_APP_API_ENDPOINT}/upload/${image.name}`,
      },
      name: image.name,
    }));
    return images;
  };

  // TODO: Fetch data from our own API
  fetchData = async () => {
    let response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}`);
    if (response.ok) {
      let { data } = await response.json();
      let imageData = this.handleData(data);
      this.setState({
        imageData,
        query: "",
        originalData: imageData,
      });
    } else {
      console.log(response);
    }
  };

  componentDidMount = () => {
    this.fetchData();
    const socket = socketIOClient(process.env.REACT_APP_API_ENDPOINT);
    socket.on("updated files", (data) => {
      // TODO: The api would return data with all images attributes. The code below is just for testing purposes
      let images = this.handleData(data);
      this.setState((prevState) => ({
        imageData: [...images, ...prevState.imageData],
        originalData: [...images, ...prevState.originalData],
      }));
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Switch>
          <Route path="/detail/:id">
            <DetailView />
          </Route>
          <Route path="/">
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
            <ImageGridListView imageData={this.state.imageData} />
          </Route>
        </Switch>
      </div>
    );
  }
}
export default withStyles(styles)(App);
