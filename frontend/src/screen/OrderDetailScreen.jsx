import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Table,
  Alert,
} from "react-bootstrap";
import { fetchOrderDetails } from "../features/order/orderSlice";
import Loader from "../components/Loader";
import { apiurl } from "../url";

const OrderDetailScreen = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const { orderDetails, loading, error } = useSelector((state) => state.order);
  const userInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      dispatch(fetchOrderDetails(id, userInfo.userId));
    }
  }, [dispatch, navigate, userInfo, id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const downloadPDF = async () => {
    try {
      const response = await fetch(`${apiurl}/api/order/invoice/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error(error);
    }
  };

  const totalPrice =
    orderDetails.totalPrice !== undefined
      ? orderDetails.totalPrice.toFixed(2)
      : "0.00";

  return (
    <Container className="my-5 p-6">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <h1 className="mb-3">Order Details</h1>
          <Button
            variant="secondary"
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button variant="primary" onClick={downloadPDF}>
            Download PDF
          </Button>
        </Col>
      </Row>

      {/* Main Content */}
      <div id="order-details" className="p-4 bg-light rounded shadow-sm">
        {/* Order Items Table */}
        <Row className="mb-4">
          <Col xs={12}>
            <Card className="shadow-sm">
              <Card.Header as="h5" className="bg-primary text-white">
                Order Items
              </Card.Header>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.orderItems &&
                      orderDetails.orderItems.map((item) => (
                        <tr key={item._id}>
                          <td>
                            <img
                              src={`${apiurl}/products/download/${item.image}`}
                              alt={item.name}
                              className="img-fluid rounded"
                              style={{ maxWidth: "80px" }}
                            />
                          </td>
                          <td>{item.name}</td>
                          <td>{item.qty}</td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>${(item.qty * item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Summary Information */}
        <Row>
          <Col xs={12} md={6} className="mb-4">
            <Card className="shadow-sm">
              <Card.Header as="h5" className="bg-primary text-white">
                Order Summary
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Order ID:</strong>
                      </Col>
                      <Col className="text-right">
                        {orderDetails.razorpay_order_id}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Total Price:</strong>
                      </Col>
                      <Col className="text-right">${totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Payment ID:</strong>
                      </Col>
                      <Col className="text-right">
                        {orderDetails.razorpay_payment_id}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Signature:</strong>
                      </Col>
                      <Col className="text-right">
                        {orderDetails.razorpay_signature}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} className="mb-4">
            <Card className="shadow-sm">
              <Card.Header as="h5" className="bg-primary text-white">
                Shipping Information
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  <strong>Name:</strong> {orderDetails.username}
                </Card.Text>
                <Card.Text>
                  <strong>Address:</strong> {orderDetails.shippingAddress},{" "}
                  {orderDetails.city}, {orderDetails.postalCode},{" "}
                  {orderDetails.country}
                </Card.Text>
                <Card.Text>
                  <strong>Phone:</strong> {orderDetails.phone}
                </Card.Text>
                <Card.Text>
                  <strong>Status:</strong>{" "}
                  {orderDetails.Isdelivered ? (
                    <span className="text-success">Delivered</span>
                  ) : (
                    <span className="text-danger">Not Delivered</span>
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default OrderDetailScreen;
