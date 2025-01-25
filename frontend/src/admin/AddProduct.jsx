import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { createProduct } from "../features/product/ProductSlice";

const AddProduct = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.product);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("countInStock", countInStock);
    formData.append("file", image);

    dispatch(createProduct(formData));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h1>Add Product</h1>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>Count in Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter stock count"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Loading…" : "Add Product"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProduct;
