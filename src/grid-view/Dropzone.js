import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { DropzoneDialog } from "material-ui-dropzone";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";

const styles = (theme) => ({
  addImage: {
    height: "97%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.divider,
    border: `2px dashed ${theme.palette.divider}`,
    padding: 0,
    transition: theme.transitions.create(["color", "border-color"]),
    "&&": {
      display: "flex",
    },
    "&:hover": {
      borderColor: "currentColor",
      color: theme.palette.text.secondary,
    },
  },
});

class UploadDropzone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      files: [],
    };
  }

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleSave = (files) => {
    //Saving files to state for further use and closing Modal.
    this.setState({
      files: files,
      open: false,
    });
    const data = new FormData();
    for (const file of files) {
      data.append("file", file);
    }
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/upload`, data)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleOpen = () => {
    this.setState({
      open: true,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        <span
          className={classes.addImage}
          rel="noopener noreferrer"
          target="_blank"
          onClick={this.handleOpen}
        >
          <AddIcon />
        </span>
        <DropzoneDialog
          open={this.state.open}
          onSave={this.handleSave}
          acceptedFiles={["image/jpeg", "image/png"]}
          filesLimit={30}
          showPreviews={true}
          maxFileSize={5000000}
          onClose={this.handleClose}
        />
      </>
    );
  }
}
export default withStyles(styles)(UploadDropzone);
