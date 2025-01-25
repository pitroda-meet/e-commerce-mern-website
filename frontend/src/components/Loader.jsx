import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = ({
  message = "Loading...",
  size = "md",
  variant = "primary",
}) => {
  const spinnerSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "md";

  return (
    <div style={styles.loaderContainer}>
      <Spinner
        animation="border"
        role="status"
        variant={variant}
        size={spinnerSize}
      >
        <span className="sr-only">Loading...</span>
      </Spinner>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
  },
  message: {
    marginTop: "1rem",
    fontSize: "1.25rem",
    color: "#555",
  },
};

export default Loader;
