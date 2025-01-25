import React, { useEffect } from "react";
import $ from "jquery";
import "jquery-validation";
import "bootswatch/dist/lux/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/user/userSlice";
import Loader from "../components/Loader";
import AlertMessage from "../components/AlertMessage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    $.validator.addMethod(
      "fnregex",
      function (value, element) {
        var regex = /^[a-zA-Z ]+$/;
        return this.optional(element) || regex.test(value);
      },
      "Name must contain only letters"
    );

    $.validator.addMethod(
      "mobregex",
      function (value, element) {
        var regex = /^[0-9]{10}$/;
        return this.optional(element) || regex.test(value);
      },
      "Please enter a valid 10-digit mobile number"
    );

    $.validator.addMethod(
      "pwdregex",
      function (value, element) {
        var regex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        return this.optional(element) || regex.test(value);
      },
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    );

    $("#signupForm").validate({
      rules: {
        name: {
          required: true,
          minlength: 2,
          maxlength: 25,
          fnregex: true,
        },
        phone: {
          required: true,
          mobregex: true,
        },
        email: {
          required: true,
          email: true,
        },
        password: {
          required: true,
          minlength: 8,
          maxlength: 20,
          pwdregex: true,
        },
        cpassword: {
          required: true,
          equalTo: "#password",
        },
      },
      messages: {
        name: {
          required: "Please enter your name",
          minlength: "Name must contain at least 2 characters",
          maxlength: "Name must not exceed 25 characters",
        },
        phone: {
          required: "Please enter your phone number",
          mobregex: "Please enter a valid mobile number",
        },
        email: {
          required: "Please enter your email",
          email: "Please enter a valid email address",
        },
        password: {
          required: "Please enter a password",
          minlength: "Password must contain at least 8 characters",
          maxlength: "Password must not exceed 20 characters",
        },
        cpassword: {
          required: "Please repeat your password",
          equalTo: "Passwords do not match",
        },
      },
      errorPlacement: function (error, element) {
        error.appendTo("#" + element.attr("id") + "_err");
      },

      submitHandler: function (form) {
        const formData = {
          name: form.name.value,
          phone: form.phone.value,
          email: form.email.value,
          password: form.password.value,
        };
        dispatch(registerUser(formData, navigate));
      },
    });
  }, [dispatch, navigate]);

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
                      Sign up
                    </p>
                    {/* {error && <AlertMessage message={` ${error}`} />} */}
                    <form id="signupForm" className="mx-1 mx-md-4">
                      <div className="d-flex flex-row align-items-center">
                        <div>
                          <i className="fa fa-user fa-lg me-3 fa-fw"></i>
                        </div>
                        <div className="form-outline flex-fill mb-1">
                          <input
                            name="name"
                            id="name"
                            type="text"
                            className="form-control"
                            placeholder="Enter your name"
                          />
                        </div>
                      </div>
                      <p
                        style={{ paddingLeft: "45px" }}
                        className="text-danger"
                        id="name_err"
                      ></p>
                      <div className="d-flex flex-row align-items-center">
                        <div>
                          <i className="fa fa-phone fa-lg me-3 fa-fw"></i>
                        </div>
                        <div className="form-outline flex-fill">
                          <input
                            name="phone"
                            id="phone"
                            type="text"
                            className="form-control"
                            placeholder="Enter your phone"
                          />
                        </div>
                      </div>
                      <p
                        style={{ paddingLeft: "45px" }}
                        className="text-danger"
                        id="phone_err"
                      ></p>
                      <div className="d-flex flex-row align-items-center">
                        <div>
                          <i className="fa fa-envelope fa-lg me-3 fa-fw"></i>
                        </div>
                        <div className="form-outline flex-fill mb-1">
                          <input
                            name="email"
                            id="email"
                            type="text"
                            className="form-control"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                      <p
                        style={{ paddingLeft: "45px" }}
                        className="text-danger"
                        id="email_err"
                      ></p>
                      <div className="d-flex flex-row align-items-center">
                        <div>
                          <i className="fa fa-lock fa-lg me-3 fa-fw"></i>
                        </div>
                        <div className="form-outline flex-fill mb-1">
                          <input
                            name="password"
                            id="password"
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                          />
                        </div>
                      </div>
                      <p
                        style={{ paddingLeft: "45px" }}
                        className="text-danger"
                        id="password_err"
                      ></p>
                      <div className="d-flex flex-row align-items-center">
                        <div>
                          <i className="fa fa-key fa-lg me-3 fa-fw"></i>
                        </div>
                        <div className="form-outline flex-fill mb-1">
                          <input
                            name="cpassword"
                            id="cpassword"
                            type="password"
                            className="form-control"
                            placeholder="Repeat your password"
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
                          className="btn btn-primary "
                          name="btn"
                        >
                          Register
                        </button>
                      </div>
                      <p className="mt-3 text-secondary text-center">
                        Existing user?{" "}
                        <Link
                          to="/login"
                          className="link-primary text-decoration-none"
                        >
                          Login
                        </Link>
                      </p>
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

export default SignupForm;
