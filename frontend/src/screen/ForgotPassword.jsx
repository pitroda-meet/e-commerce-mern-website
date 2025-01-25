import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import $ from "jquery";
import "jquery-validation";
import { weburl } from "../URL/url";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    // jQuery validation setup
    $("#forgotPasswordForm").validate({
      rules: {
        email: {
          required: true,
          email: true,
        },
      },
      messages: {
        email: {
          required: "Please enter your email address",
          email: "Please enter a valid email address",
        },
      },
      errorPlacement: function (error, element) {
        error.appendTo("#email_err");
      },
    });
  }, []);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if ($("#forgotPasswordForm").valid()) {
      try {
        const response = await fetch(`${weburl}/user/forgotpassword`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.info(data.message);
          setEmail("");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Error sending email");
      }
    }
  };

  return (
    <section className="vh-50 m-4">
      <div className="container h-50">
        <div className="row d-flex justify-content-center align-items-center h-50">
          <div className="col-lg-7 col-xl-5 col-md-9">
            <div
              className="card text-black"
              style={{
                borderRadius: "25px",
                boxShadow: "0px 0px 20px 1px rgba(143,143,143,0.3)",
              }}
            >
              <div className="card-body p-md-3">
                <div className="row justify-content-center">
                  <div className="col-12 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-4 mx-1 mx-md-4 mt-4">
                      Forgot Password
                    </p>
                    <form
                      id="forgotPasswordForm"
                      onSubmit={handleForgotPassword}
                      className="mx-1 mx-md-4"
                    >
                      <div className="d-flex flex-row align-items-center">
                        <div>
                          <i className="fa fa-envelope fa-lg me-3 fa-fw"></i>
                        </div>
                        <div className="form-outline flex-fill mb-1">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            placeholder="Enter your email"
                            name="email"
                          />
                        </div>
                      </div>
                      <p
                        style={{ paddingLeft: "45px" }}
                        className="text-danger"
                        id="email_err"
                      ></p>
                      <div className="d-grid gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary "
                          name="btn"
                        >
                          Send Email
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
