import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProducts,
  updateProduct,
  deleteProduct,
} from "../features/product/ProductSlice";
import { apiurl } from "../url";

const AdminProduct = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    brand: "",
    category: "",
    description: "",
    price: "",
    countInStock: "",
  });

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name || "",
        image: editProduct.image || "",
        brand: editProduct.brand || "",
        category: editProduct.category || "",
        description: editProduct.description || "",
        price: editProduct.price || "",
        countInStock: editProduct.countInStock || "",
      });
    } else {
      setFormData({
        name: "",
        image: "",
        brand: "",
        category: "",
        description: "",
        price: "",
        countInStock: "",
      });
    }
  }, [editProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSave = () => {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("brand", formData.brand);
    form.append("category", formData.category);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("countInStock", formData.countInStock);
    if (formData.image) {
      form.append("file", formData.image);
    }

    if (editProduct) {
      // Update product
      dispatch(
        updateProduct(
          editProduct._id,
          formData.image ? formData.image.name : editProduct.image,
          form
        )
      );
    }

    setShowModal(false);
    setEditProduct(null);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const handleDelete = (id, filename) => {
    dispatch(deleteProduct(id, filename));
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Description</th>
            <th>Price</th>
            <th>Count In Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>
                <img
                  src={`${apiurl}/products/download/${product.image}`}
                  alt={product.name}
                  width="100"
                />
              </td>
              <td>{product.brand}</td>
              <td>{product.category}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.countInStock}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(product)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(product._id, product.image)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditProduct(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Product Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                placeholder="Product Image"
                name="image"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Form.Group controlId="formBrand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Product Brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Product Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Product Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Product Price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formCountInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Count In Stock"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setEditProduct(null);
            }}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Update Product
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminProduct;
