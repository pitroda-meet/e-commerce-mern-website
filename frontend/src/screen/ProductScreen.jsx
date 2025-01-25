import React from "react";
import { Card } from "react-bootstrap";
import Rating from "../components/Rating";
import { LinkContainer } from "react-router-bootstrap";
import { apiurl } from "../url";

const ProductScreen = ({ product }) => {
  return (
    <div className="product-card-wrapper">
      <Card className="my-3 p-3 rounded h-100">
        <LinkContainer to={`/products/${product._id}`}>
          <Card.Img
            src={`${apiurl}/products/download/${product.image}`}
            alt={product.name}
            variant="top"
          />
        </LinkContainer>
        <LinkContainer to={`/products/${product._id}`}>
          <Card.Body>
            <Card.Title as="div">
              <strong>{product.name}</strong>
            </Card.Title>
            <Card.Text as="div">
              <Rating
                value={product.rating}
                text={`${product.numReviews}reviews`}
              />
            </Card.Text>
            <Card.Text as="div">${product.price}</Card.Text>
          </Card.Body>
        </LinkContainer>
      </Card>
    </div>
  );
};

export default ProductScreen;
