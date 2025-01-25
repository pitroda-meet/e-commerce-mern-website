import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Table, Container, Spinner, Alert, Button } from "react-bootstrap";
import { fetchOrders } from "../features/order/orderSlice";
import Loader from "../components/Loader";
import AlertMessage from "../components/AlertMessage";
import { FcViewDetails } from "react-icons/fc";

const OrdersScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loading, error } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      dispatch(fetchOrders(userInfo.userId));
    }
  }, [dispatch, navigate, userInfo]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <AlertMessage />;
  }

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Orders</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Username</th>
            <th>Phone</th>
            <th>Total Price</th>
            <th>Date</th>
            <th>City</th>
            <th>View more</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} onClick={() => navigate(`/order/${order._id}`)}>
              <td>{order.username}</td>
              <td>{order.phone}</td>
              <td>${order.totalPrice.toFixed(2)}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>{order.city}</td>
              <td onClick={() => navigate(`/order/${order._id}`)}>
                <FcViewDetails className="fs-2" />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default OrdersScreen;
