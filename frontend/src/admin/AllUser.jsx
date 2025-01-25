import React, { useEffect, useState } from "react";
import { fetchUser, updateUserRole } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Form, Table } from "react-bootstrap";
import Loader from "../components/Loader";

const AllUser = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  // Local state to handle role selection for each user
  const [roles, setRoles] = useState({});

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // Initialize roles state when users are loaded
  useEffect(() => {
    if (user) {
      const initialRoles = user.reduce((acc, currentUser) => {
        acc[currentUser._id] = currentUser.isAdmin ? "Admin" : "User";
        return acc;
      }, {});
      setRoles(initialRoles);
    }
  }, [user]);

  const handleRoleChange = async (userId, newRole) => {
    setRoles((prevRoles) => ({
      ...prevRoles,
      [userId]: newRole,
    }));

    const isAdmin = newRole === "Admin";
    await dispatch(updateUserRole(userId, isAdmin));
  };

  return (
    <div className="p-4">
      <h1 className="mb-4">User Management</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {user.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <Form.Control
                    as="select"
                    value={roles[user._id]}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </Form.Control>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default AllUser;
