import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { fetchProducts } from "../features/product/ProductSlice";
import Loader from "../components/Loader";
import AlertMessage from "../components/AlertMessage";
import ProductScreen from "./ProductScreen";

const HomeScreen = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  const productList = useSelector((state) => state.product);
  const { products, loading, error } = productList;

  if (loading) return <Loader />;
  if (error) return <AlertMessage message={`Error: ${error}`} />;

  return (
    <Row xs={1} md={2} lg={4}>
      {Array.isArray(products) &&
        products.map((product) => (
          <Col key={product._id}>
            <ProductScreen product={product} />
          </Col>
        ))}
    </Row>
  );
};

export default HomeScreen;
