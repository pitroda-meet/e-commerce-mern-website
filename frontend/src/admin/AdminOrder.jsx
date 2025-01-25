import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { fetchAdminOrders } from "../features/order/orderSlice";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const AdminOrderList = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  return (
    <div>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Phone</th>
              <th>Total Price</th>
              <th>Is Delivered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.username}</td>
                <td>{order.phone}</td>
                <td>{order.totalPrice}</td>
                <td>{order.Isdelivered ? "Yes" : "No"}</td>
                <td>
                  <Link to={`/admin/order/${order._id}`}>
                    <Button variant="info">View Details</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AdminOrderList;
