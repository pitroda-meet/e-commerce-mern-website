import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/user/userSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand px-3 border-bottom">
      <button className="btn" id="sidebar-toggle" type="button">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="navbar-collapse navbar">
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <a href="#" data-bs-toggle="dropdown" className="nav-icon pe-md-0">
              <img
                src="image/profile.jpg"
                className="avatar img-fluid rounded"
                alt=""
              />
            </a>
            <div className="dropdown-menu dropdown-menu-end">
              <a href="#" className="dropdown-item">
                Profile
              </a>
              <a href="#" className="dropdown-item">
                Setting
              </a>
              {userInfo && (
                <a href="#" className="dropdown-item" onClick={handleLogout}>
                  Logout
                </a>
              )}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
