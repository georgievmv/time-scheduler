import React from "react";
import { ProgressBar } from "react-bootstrap";

const LoadingBar = () => (
  <ProgressBar
    className="w-50"
    now={100}
    animated={true}
    striped={true}
  ></ProgressBar>
);

export default LoadingBar;
