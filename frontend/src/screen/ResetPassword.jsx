import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootswatch/dist/lux/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import $ from "jquery";
import "jquery-validation";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // jQuery validation setup
    $("#resetPasswordForm").validate({
      rules: {
        password: {
          required: true,
          minlength: 6,
        },
        confirmPassword: {
          required: true,
          equalTo: "#password",
        },
      },
      messages: {
        password: {
          required: "Please enter a new password",
          minlength: "Password must be at least 6 characters long",
        },
        confirmPassword: {
          required: "Please confirm your new password",
          equalTo: "Passwords do not match",
        },
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") === "password") {
          error.appendTo("#password_err");
        } else if (element.attr("name") === "confirmPassword") {
          error.appendTo("#cpassword_err");
        } else {
          error.insertAfter(element);
        }
      },
    });
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if ($("#resetPasswordForm").valid()) {
      try {
        const response = await fetch(
          `http://localhost:8070/user/resetpassword/${token}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ password }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          toast.success(data.message);
          navigate("/login");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Error resetting password");
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
                      Reset Password
                    </p>
                    <form
                      id="resetPasswordForm"
                      onSubmit={handleResetPassword}
                      className="mx-1 mx-md-4"
                    >
                      <div className="d-flex flex-row align-items-center mb-3">
                        <div>
                          <i className="fa fa-lock fa-lg me-3 fa-fw"></i>
                        </div>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            placeholder="Enter new password"
                            name="password"
                          />
                        </div>
                      </div>
                      <p
                        style={{ paddingLeft: "45px" }}
                        className="text-danger"
                        id="password_err"
                      ></p>
                      <div className="d-flex flex-row align-items-center mb-3">
                        <div>
                          <i className="fa fa-key fa-lg me-3 fa-fw"></i>
                        </div>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="form-control"
                            placeholder="Confirm new password"
                            name="confirmPassword"
                          />
                        </div>
                      </div>
                      <p
                        style={{ paddingLeft: "45px" }}
                        className="text-danger"
                        id="cpassword_err"
                      ></p>
                      <div className="d-grid gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          name="btn"
                        >
                          Reset Password
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

export default ResetPassword;
