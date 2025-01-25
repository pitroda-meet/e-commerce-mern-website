import React from "react";
import { Alert } from "react-bootstrap";

const AlertMessage = ({ variant = "danger", message }) => {
  return (
    <Alert variant={variant} style={styles.alert}>
      {message}
    </Alert>
  );
};

const styles = {
  alert: {
    textAlign: "center",
    margin: "1rem 0",
  },
};

export default AlertMessage;
