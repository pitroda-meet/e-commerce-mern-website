import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Toast,
  ListGroup,
} from "react-bootstrap";
import $ from "jquery";
import "jquery-validation";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProductsAsync,
  removeAllCartItem,
} from "../features/cart/cartSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import AlertMessage from "../components/AlertMessage";
import { weburl } from "../URL/url";

const CheckoutForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, loading, error } = useSelector((state) => state.cart);
  const userInfo = useSelector((state) => state.user.userInfo);

  const [orderData, setOrderData] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
    email: "",
    note: "",
    paymentMethod: "PayPal",
    totalPrice: 0.0,
  });

  useEffect(() => {
    document.cookie = "user_session=abc123; SameSite=Lax; Secure";

    if (!userInfo) {
      navigate("/login");
    } else {
      dispatch(fetchProductsAsync(userInfo.userId));
    }
  }, [dispatch, userInfo, navigate]);

  useEffect(() => {
    document.cookie = "user_session=abc123; SameSite=Lax; Secure";
    $("#checkoutForm").validate({
      rules: {
        name: {
          required: true,
          minlength: 2,
          lettersonly: true, // Custom validation for alphabets only
        },
        email: {
          required: true,
          email: true,
        },
        phone: {
          required: true,
          minlength: 10,
          digits: true, // Validation for digits only
        },
        address: {
          required: true,
        },
        city: {
          required: true,
        },
        postalCode: {
          required: true,
          digits: true, // Validation for digits only
        },
        country: {
          required: true,
        },
      },
      messages: {
        name: {
          required: "Please enter your name",
          minlength: "Name must be at least 2 characters",
          lettersonly: "Please enter only alphabet characters",
        },
        email: {
          required: "Please enter your email address",
          email: "Please enter a valid email address",
        },
        phone: {
          required: "Please enter your phone number",
          minlength: "Phone number must be at least 10 digits",
          digits: "Please enter only digits",
        },
        address: "Please enter your address",
        city: "Please enter your city",
        postalCode: {
          required: "Please enter your postal code",
          digits: "Please enter only digits",
        },
        country: "Please enter your country",
      },
      errorPlacement: function (error, element) {
        var errorId = element.attr("id") + "Error";
        error.appendTo($("#" + errorId));
      },
    });

    $.validator.addMethod(
      "lettersonly",
      function (value, element) {
        return this.optional(element) || /^[a-zA-Z\s]+$/i.test(value);
      },
      "Please enter only alphabetic characters"
    );
  }, []);

  const calculateSubtotal = () => {
    if (!cartItems || cartItems.length === 0) {
      return "0.00";
    }
    return cartItems
      .reduce((acc, item) => acc + item.quantity * item.price, 0)
      .toFixed(2);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if ($("#checkoutForm").valid()) {
      document.cookie = "user_session=abc123; SameSite=Lax; Secure";

      const order = {
        user: userInfo.userId,
        username: orderData.name,
        phone: orderData.phone,
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.quantity,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress: orderData.address,
        city: orderData.city,
        postalCode: parseInt(orderData.postalCode),
        country: orderData.country,
        paymentMethod: orderData.paymentMethod,
      };

      const amount = calculateSubtotal();
      try {
        const res = await fetch(`${weburl}/api/order`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            amount,
            order,
          }),
        });

        const data = await res.json();
        handlePaymentVerify(data.data, order, data.amount * 100);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlePaymentVerify = async (data, order, amount) => {
    document.cookie = "user_session=abc123; SameSite=Lax; Secure";
    const options = {
      key: "rzp_test_FNY2BJxFQpkE2l",
      amount: amount,
      currency: data.currency,
      name: order.username,
      phone: order.phone,
      description: "Test Mode",
      order_id: data.id,
      handler: async (response) => {
        console.log("response", response);
        try {
          const res = await fetch(`${weburl}/api/verify`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              user: order.user,
              username: order.username,
              phone: order.phone,
              orderItems: order.orderItems,
              shippingAddress: order.shippingAddress,
              city: order.city,
              postalCode: order.postalCode,
              country: order.country,
              paymentMethod: order.paymentMethod,
              amount: amount,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await res.json();

          if (verifyData.message) {
            toast.success(verifyData.message);
            await dispatch(removeAllCartItem(userInfo.userId));
            dispatch(fetchProductsAsync(userInfo.userId));
            navigate("/order");
          } else {
            toast.error("Payment verification failed.");
          }
        } catch (error) {
          toast.error("An error occurred during payment verification.");
          console.log(error);
        }
      },
      theme: {
        color: "#5f63b8",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <AlertMessage variant="danger">{error}</AlertMessage>;
  }

  return (
    <Container className="mt-3">
      <Row>
        <Col md={7}>
          <Card>
            <Card.Header>
              <h2 className="text-center">Checkout</h2>
            </Card.Header>
            <Card.Body>
              <Form id="checkoutForm" onSubmit={handlePayment}>
                <Form.Group controlId="name" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    required
                    value={orderData.name}
                    onChange={(e) =>
                      setOrderData({ ...orderData, name: e.target.value })
                    }
                  />
                  <p id="nameError" className="text-danger"></p>
                </Form.Group>
                <Form.Group controlId="address" className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="address"
                    rows={3}
                    required
                    value={orderData.address}
                    onChange={(e) =>
                      setOrderData({ ...orderData, address: e.target.value })
                    }
                  />
                  <p id="addressError" className="text-danger"></p>
                </Form.Group>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="phone">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        required
                        value={orderData.phone}
                        onChange={(e) =>
                          setOrderData({ ...orderData, phone: e.target.value })
                        }
                      />
                      <p id="phoneError" className="text-danger"></p>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        required
                        value={orderData.email}
                        onChange={(e) =>
                          setOrderData({ ...orderData, email: e.target.value })
                        }
                      />
                      <p id="emailError" className="text-danger"></p>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="city">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        required
                        value={orderData.city}
                        onChange={(e) =>
                          setOrderData({ ...orderData, city: e.target.value })
                        }
                      />
                      <p id="cityError" className="text-danger"></p>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="postalCode">
                      <Form.Label>Postal Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="postalCode"
                        required
                        value={orderData.postalCode}
                        onChange={(e) =>
                          setOrderData({
                            ...orderData,
                            postalCode: e.target.value,
                          })
                        }
                      />
                      <p id="postalCodeError" className="text-danger"></p>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="country" className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    required
                    value={orderData.country}
                    onChange={(e) =>
                      setOrderData({ ...orderData, country: e.target.value })
                    }
                  />
                  <p id="countryError" className="text-danger"></p>
                </Form.Group>

                <Button variant="primary" onClick={handlePayment}>
                  Proceed to Payment
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={5}>
          <Card className="shadow-sm">
            <Card.Header>
              <h4 className="text-center">Order Summary</h4>
            </Card.Header>
            <Card.Body>
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <Card key={index} className="mb-3 border-0">
                    <Row className="g-0">
                      <Col xs={4} md={4}>
                        <Card.Img
                          src={`${weburl}/products/download/${item.image}`}
                          alt={item.name}
                          className="img-fluid rounded-start"
                          style={{ objectFit: "cover", maxHeight: "100%" }}
                        />
                      </Col>
                      <Col xs={8} md={8}>
                        <Card.Body>
                          <Card.Title className="h6">{item.name}</Card.Title>
                          <Card.Text>
                            <strong>Price:</strong> ₹
                            {(item.price * item.quantity).toFixed(2)}
                            <br />
                            <strong>Quantity:</strong> {item.quantity}
                          </Card.Text>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                ))
              ) : (
                <Card.Body className="text-center">No items added</Card.Body>
              )}
              <ListGroup className="mt-3">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Total (Rupees)</span>
                  <strong>₹ {calculateSubtotal()}</strong>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutForm;
