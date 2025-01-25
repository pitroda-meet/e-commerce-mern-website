import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchProductsAsync,
  removeAllCartItem,
  removeFromCartAsync,
  updateCartQtyAsync,
} from "../features/cart/cartSlice";
import Loader from "../components/Loader";
import AlertMessage from "../components/AlertMessage";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, loading, error } = useSelector((state) => state.cart);
  const userInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchProductsAsync(userInfo.userId));
    } else {
      navigate("/login");
    }
  }, [dispatch, userInfo, navigate]);

  const removeFromCartHandler = async (productId) => {
    await dispatch(removeFromCartAsync({ productId }));
    dispatch(fetchProductsAsync(userInfo.userId));
  };

  const removeAll = async () => {
    await dispatch(removeAllCartItem(userInfo.userId));
    dispatch(fetchProductsAsync(userInfo.userId));
  };

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate("/login");
    } else {
      navigate("/chackout");
    }
  };

  const updateQtyHandler = async (productId, quantity) => {
    await dispatch(
      updateCartQtyAsync({ productId, quantity, userId: userInfo.userId })
    );
    dispatch(fetchProductsAsync(userInfo.userId));
  };

  const calculateSubtotal = () => {
    return cartItems
      ? cartItems
          .reduce((acc, item) => acc + item.quantity * item.price, 0)
          .toFixed(2)
      : "0.00";
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <AlertMessage variant="danger">{error}</AlertMessage>;
  }
  return (
    <Container>
      {!cartItems || cartItems.length === 0 ? (
        <div
          className="container d-flex align-items-center justify-content-center"
          style={{ height: "100vh" }}
        >
          <div className="text-center">
            <h2 className="text-muted">Your Cart is Empty</h2>
            <p className="lead">
              Browse our products and find something you like!
            </p>
            <Link to="/" className="btn btn-primary">
              Shop Now
            </Link>
          </div>
        </div>
      ) : (
        <Row className="justify-content-center">
          <Col xs={12} lg={8}>
            <ListGroup variant="flush">
              {cartItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row className="align-items-center">
                    <Col xs={4} sm={2} lg={2}>
                      <Image
                        src={`http://localhost:8070/products/download/${item.image}`}
                        alt={item.name}
                        fluid
                        rounded
                        className="img-fluid"
                      />
                    </Col>
                    <Col xs={8} sm={6} lg={3}>
                      <span>{item.name}</span>
                    </Col>
                    <Col xs={6} sm={2} lg={2}>
                      ${item.price}
                    </Col>
                    <Col xs={6} sm={2} lg={2}>
                      <Form.Control
                        as="select"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQtyHandler(
                            item.productId,
                            Number(e.target.value)
                          )
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col xs={4} sm={2} lg={1}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => removeFromCartHandler(item.productId)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          {cartItems && cartItems.length > 0 && (
            <Col xs={12} lg={4} className="mt-4 mt-lg-0">
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>
                      Subtotal (
                      {cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                      items
                    </h3>
                    ${calculateSubtotal()}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn-block"
                      disabled={cartItems.length === 0}
                      onClick={checkoutHandler}
                    >
                      Proceed to Checkout
                    </Button>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn-block"
                      variant="danger"
                      onClick={removeAll}
                    >
                      Clear Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default CartScreen;
