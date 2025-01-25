import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import {
  Container,
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductDetails } from "../features/product/ProductSlice";
import Loader from "../components/Loader";
import AlertMessage from "../components/AlertMessage";
import { addToCartAsync } from "../features/cart/cartSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const productDetails = useSelector((state) => state.product);
  const userInfo = useSelector((state) => state.user.userInfo?.userId);

  const { product, loading, error } = productDetails;

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  const addToCartHandler = () => {
    if (!userInfo) {
      navigate("/login");
    } else {
      dispatch(addToCartAsync({ productId: id, quantity: qty })).then(() => {
        setQty(1);
        navigate("/cart");
      });
    }
  };

  if (loading) return <Loader />;
  if (error) return <AlertMessage message={`Error: ${error}`} />;
  return (
    <Container className="product-details-container">
      <Row>
        <Col md={6}>
          <LinkContainer to="/" className="btn btn-light">
            <i className="fas fa-arrow-left fs-3">&nbsp;GO BACK</i>
          </LinkContainer>
          <Image
            src={`http://localhost:8070/products/download/${product.image}`}
            alt={product.name}
            fluid
            className="product-image"
          />
        </Col>
        <Col md={6}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h1 className="product-name fs-1">{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
            </ListGroup.Item>
            <ListGroup.Item className="fs-3">
              <strong>Price:</strong> ${product.price}
            </ListGroup.Item>
            <ListGroup.Item className="fs-3">
              <strong>Brand:</strong> {product.brand}
            </ListGroup.Item>
            <ListGroup.Item className="fs-3">
              <strong>Category:</strong> {product.category}
            </ListGroup.Item>
            <ListGroup.Item className="fs-4">
              <strong>Description:</strong> {product.description}
            </ListGroup.Item>
          </ListGroup>
          <Card className="my-3 border-0">
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                  </Col>
                </Row>
              </ListGroup.Item>
              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  className="btn-block add-to-cart-btn me-1"
                  type="button"
                  disabled={product.countInStock === 0}
                  onClick={addToCartHandler}
                >
                  Add to Cart
                </Button>
                <Button
                  className="btn-block add-to-cart-btn"
                  type="button"
                  onClick={() => navigate("/")}
                >
                  Home
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;
