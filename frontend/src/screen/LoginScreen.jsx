import React, { useEffect } from "react";
import $ from "jquery";
import "jquery-validation";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/user/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    $("#loginForm").validate({
      rules: {
        email: {
          required: true,
          email: true,
        },
        password: {
          required: true,
        },
      },
      messages: {
        email: {
          required: "Please enter your email",
          email: "Please enter a valid email address",
        },
        password: {
          required: "Please enter your password",
        },
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") === "email") {
          error.appendTo("#email_err");
        } else if (element.attr("name") === "password") {
          error.appendTo("#password_err");
        } else {
          error.insertAfter(element);
        }
      },
      submitHandler: function (form) {
        const formData = {
          email: form.email.value,
          password: form.password.value,
        };
        dispatch(loginUser(formData, navigate));
      },
    });
  }, [dispatch, navigate]);

  return (
    <section className="py-5 py-md-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
            <div className="card border border-light-subtle rounded-3 shadow-sm">
              <div className="card-body p-3 p-md-4 px-xl-5">
                <p className="text-center h1 fw-bold mb-4 mx-1 mx-md-4">
                  Login
                </p>
                <h2 className="fs-6 fw-normal text-center text-secondary mb-4">
                  Sign in to your account
                </h2>
                <form id="loginForm">
                  <div className="row gy-2 overflow-hidden">
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          id="email"
                          placeholder="name@example.com"
                        />
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                      </div>
                      <p id="email_err" className="text-danger"></p>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          id="password"
                          placeholder="Password"
                        />
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                      </div>
                      <p id="password_err" className="text-danger"></p>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary  w-100">
                        {loading ? "Loading..." : "Login"}
                      </button>
                    </div>
                    {error && (
                      <div className="col-12">
                        <p className="text-danger text-center">{error}</p>
                      </div>
                    )}
                    <div className="col-12 text-center">
                      <p className="small mb-0">
                        Don't have an account?{" "}
                        <Link to="/signup" className="fw-semibold">
                          Sign Up
                        </Link>
                      </p>
                    </div>
                    <div className="col-12 text-center">
                      <p className="small mb-0">
                        Forgot password?{" "}
                        <Link to="/forgot-password" className="fw-semibold">
                          Reset Password
                        </Link>
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
