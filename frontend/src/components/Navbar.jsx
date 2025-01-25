import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navbar, Container, Nav } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { BiMessageAltDetail } from "react-icons/bi";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../features/user/userSlice";

const BasicExample = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark" collapseOnSelect>
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>online shop</Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/contect">
              <Nav.Link>
                <BiMessageAltDetail className="mb-1 me-1" />
                <span>contect</span>
              </Nav.Link>
            </LinkContainer>
            {userInfo && (
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart className="mb-1 me-1"></FaShoppingCart>
                  <span>Cart</span>
                </Nav.Link>
              </LinkContainer>
            )}

            {/* Login/Logout Button */}
            {userInfo ? (
              <Nav.Link onClick={handleLogout}>
                <FaUser className="mb-1 me-1" />
                Logout
              </Nav.Link>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link>
                  <FaUser className="mb-1 me-1" />
                  Login
                </Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default BasicExample;
