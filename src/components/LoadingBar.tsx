import React from "react";
import { ProgressBar } from "react-bootstrap";

const LoadingBar = () => {
  return (
    <ProgressBar
      className="w-50"
      now={100}
      animated={true}
      striped={true}
    ></ProgressBar>
  );
};

export default LoadingBar;
