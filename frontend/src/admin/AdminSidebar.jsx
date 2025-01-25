import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  useEffect(() => {
    const sidebarToggle = document.querySelector("#sidebar-toggle");
    const themeToggle = document.querySelector(".theme-toggle");

    const handleSidebarToggle = () => {
      document.querySelector("#sidebar").classList.toggle("collapsed");
    };

    const handleThemeToggle = () => {
      toggleLocalStorage();
      toggleRootClass();
    };

    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", handleSidebarToggle);
    }

    if (themeToggle) {
      themeToggle.addEventListener("click", handleThemeToggle);
    }

    if (isLight()) {
      toggleRootClass();
    }

    return () => {
      if (sidebarToggle) {
        sidebarToggle.removeEventListener("click", handleSidebarToggle);
      }
      if (themeToggle) {
        themeToggle.removeEventListener("click", handleThemeToggle);
      }
    };
  }, []);

  const toggleRootClass = () => {
    const current = document.documentElement.getAttribute("data-bs-theme");
    const inverted = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-bs-theme", inverted);
  };

  const toggleLocalStorage = () => {
    if (isLight()) {
      localStorage.removeItem("light");
    } else {
      localStorage.setItem("light", "set");
    }
  };

  const isLight = () => {
    return localStorage.getItem("light");
  };

  return (
    <aside id="sidebar" className="js-sidebar">
      <div className="h-100">
        <div className="sidebar-logo">
          <a href="#">CodzSword</a>
        </div>
        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <LinkContainer to="/admin/dashboard">
              <Link className="sidebar-link">
                <i className="fa-solid fa-tachometer-alt pe-2"></i>
                Dashboard
              </Link>
            </LinkContainer>
          </li>
          <li className="sidebar-item">
            <LinkContainer
              to="/admin/product"
              className="sidebar-link collapsed"
              data-bs-target="#pages"
              data-bs-toggle="collapse"
              aria-expanded="false"
            >
              <Link>
                <i className="fa-solid fa-box pe-2"></i>
                Product
              </Link>
            </LinkContainer>
            <ul
              id="pages"
              className="sidebar-dropdown list-unstyled collapse"
              data-bs-parent="#sidebar"
            >
              <li className="sidebar-item">
                <LinkContainer to="/admin/addproduct/" className="sidebar-link">
                  <Link>Add Product</Link>
                </LinkContainer>
              </li>
              <li className="sidebar-item">
                <LinkContainer to="/admin/product/" className="sidebar-link">
                  <Link>All Products</Link>
                </LinkContainer>
              </li>
            </ul>
          </li>
          <li className="sidebar-item">
            <LinkContainer to="/admin/orders">
              <Link className="sidebar-link">
                <i className="fa-solid fa-box pe-2"></i>
                Orders
              </Link>
            </LinkContainer>
          </li>
          <li className="sidebar-item">
            <LinkContainer to="/admin/AllUser">
              <Link className="sidebar-link">
                <i className="fa-solid fa-users pe-2"></i>
                Users
              </Link>
            </LinkContainer>
          </li>

          {/* <li className="sidebar-item">
            <a
              href="#"
              className="sidebar-link collapsed"
              data-bs-target="#posts"
              data-bs-toggle="collapse"
              aria-expanded="false"
            >
              <i className="fa-solid fa-sliders pe-2"></i>
              Posts
            </a>
            <ul
              id="posts"
              className="sidebar-dropdown list-unstyled collapse"
              data-bs-parent="#sidebar"
            >
              <li className="sidebar-item">
                <a href="#" className="sidebar-link">
                  Post 1
                </a>
              </li>
              <li className="sidebar-item">
                <a href="#" className="sidebar-link">
                  Post 2
                </a>
              </li>
              <li className="sidebar-item">
                <a href="#" className="sidebar-link">
                  Post 3
                </a>
              </li>
            </ul>
          </li>
          <li className="sidebar-item">
            <a
              href="#"
              className="sidebar-link collapsed"
              data-bs-target="#auth"
              data-bs-toggle="collapse"
              aria-expanded="false"
            >
              <i className="fa-regular fa-user pe-2"></i>
              Auth
            </a>
            <ul
              id="auth"
              className="sidebar-dropdown list-unstyled collapse"
              data-bs-parent="#sidebar"
            >
              <li className="sidebar-item">
                <a href="#" className="sidebar-link">
                  Login
                </a>
              </li>
              <li className="sidebar-item">
                <a href="#" className="sidebar-link">
                  Register
                </a>
              </li>
              <li className="sidebar-item">
                <a href="#" className="sidebar-link">
                  Forgot Password
                </a>
              </li>
            </ul>
          </li>
          <li className="sidebar-header">Multi Level Menu</li>
          <li className="sidebar-item">
            <a
              href="#"
              className="sidebar-link collapsed"
              data-bs-target="#multi"
              data-bs-toggle="collapse"
              aria-expanded="false"
            >
              <i className="fa-solid fa-share-nodes pe-2"></i>
              Multi Dropdown
            </a>
            <ul
              id="multi"
              className="sidebar-dropdown list-unstyled collapse"
              data-bs-parent="#sidebar"
            >
              <li className="sidebar-item">
                <a
                  href="#"
                  className="sidebar-link collapsed"
                  data-bs-target="#level-1"
                  data-bs-toggle="collapse"
                  aria-expanded="false"
                >
                  Level 1
                </a>
                <ul
                  id="level-1"
                  className="sidebar-dropdown list-unstyled collapse"
                >
                  <li className="sidebar-item">
                    <a href="#" className="sidebar-link">
                      Level 1.1
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="#" className="sidebar-link">
                      Level 1.2
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li> */}
        </ul>
      </div>
    </aside>
  );
};

export default AdminSidebar;
