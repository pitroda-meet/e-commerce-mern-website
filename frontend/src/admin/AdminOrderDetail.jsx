import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  ListGroup,
  Spinner,
  Alert,
  Button,
  Form,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  fetchAdminOrderDetails,
  updateOrderStatuss,
} from "../features/order/orderSlice";
import Loader from "../components/Loader";

const AdminOrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.order);
  const [status, setStatus] = useState();

  useEffect(() => {
    dispatch(fetchAdminOrderDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (orderDetails) {
      setStatus(orderDetails.Isdelivered ? "Delivered" : "Pending");
    }
  }, [orderDetails]);

  const handleUpdateStatus = async () => {
    await dispatch(updateOrderStatuss(id, status === "Delivered"));
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Order Details</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        orderDetails && (
          <Card>
            <Card.Header>
              <Row>
                <Col md={6}>
                  <strong>Order ID:</strong> {orderDetails._id}
                </Col>
                <Col md={6} className="text-right">
                  <strong>Total Price:</strong> ₹{orderDetails.totalPrice}
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col md={6}>
                      <strong>Username:</strong> {orderDetails.username}
                    </Col>
                    <Col md={6}>
                      <strong>Phone:</strong> {orderDetails.phone}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Shipping Address:</strong>{" "}
                  {orderDetails.shippingAddress}, {orderDetails.city},{" "}
                  {orderDetails.postalCode}, {orderDetails.country}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Items:</strong>
                  <ListGroup>
                    {orderDetails.orderItems &&
                      orderDetails.orderItems.map((item) => (
                        <ListGroup.Item key={item.product}>
                          <Row className="align-items-center">
                            <Col md={2}>
                              <Image
                                src={`http://localhost:8070/products/download/${item.image}`}
                                alt={item.name}
                                fluid
                                rounded
                              />
                            </Col>
                            <Col>
                              {item.name} x {item.qty} - ₹{item.price}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col md={6}>
                      <strong>Razorpay Payment ID:</strong>{" "}
                      {orderDetails.razorpay_payment_id}
                    </Col>
                    <Col md={6}>
                      <strong>Razorpay Order ID:</strong>{" "}
                      {orderDetails.razorpay_order_id}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Razorpay Signature:</strong>{" "}
                  {orderDetails.razorpay_signature}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Form.Group controlId="orderStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      as="select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Delivered">Delivered</option>
                    </Form.Control>
                  </Form.Group>
                  <Button
                    variant="primary"
                    onClick={handleUpdateStatus}
                    className="mt-2"
                  >
                    Update Status
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        )
      )}
    </div>
  );
};

export default AdminOrderDetail;
