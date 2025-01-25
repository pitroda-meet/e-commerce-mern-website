import React, { useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootswatch/dist/lux/bootstrap.min.css";
import $ from "jquery";
import "jquery-validation";
import { apiurl } from "../url";

const ContactScreen = () => {
  useEffect(() => {
    $(document).ready(function () {
      $("#contactForm").validate({
        rules: {
          name: "required",
          email: {
            required: true,
            email: true,
          },
          message: "required",
        },
        messages: {
          name: "Please enter your name",
          email: {
            required: "Please enter your email",
            email: "Please enter a valid email address",
          },
          message: "Please enter your message",
        },
        errorElement: "span",
        errorPlacement: function (error, element) {
          error.addClass("text-danger");
          error.attr("id", element.attr("name") + "-error");
          error.appendTo(element.parent());
        },
        submitHandler: function (form) {
          const formData = {
            email: form.email.value,
            name: form.name.value,
            message: form.message.value,
          };

          fetch(`${apiurl}/form/contect"`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          })
            .then((response) => {
              if (response.ok) {
                alert("Message sent successfully!");
                form.reset(); // Reset form fields after successful submission
              } else {
                throw new Error("Network response was not ok.");
              }
            })
            .catch((error) => {
              console.error("Error sending message:", error);
              alert("Failed to send message. Please try again later.");
            });
        },
      });
    });
  }, []);

  return (
    <Container className="my-5 py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <div
            className="p-4 rounded"
            style={{ boxShadow: "0px 0px 20px 1px rgba(143,143,143,0.3)" }}
          >
            <h2 className="mb-4">Contact Us</h2>
            <Form id="contactForm" method="post">
              <Form.Group className="mb-3">
                <Form.Label>Your Name</Form.Label>
                <Form.Control
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                />
                <span className="error-span text-danger" id="name-error"></span>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Your Email</Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                />
                <span
                  className="error-span text-danger"
                  id="email-error"
                ></span>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Enter your message"
                  required
                />
                <span
                  className="error-span text-danger"
                  id="message-error"
                ></span>
              </Form.Group>
              <Button type="submit" className="btn btn-primary">
                Submit
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactScreen;
