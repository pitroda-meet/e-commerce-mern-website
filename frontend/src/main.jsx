import React from "react";
import { createRoot } from "react-dom/client"; // Update this line
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import "bootswatch/dist/lux/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "./index.css";
import Home from "./components/Home.jsx";
import ProductDetails from "./screen/ProductDetails.jsx";
import CartScreen from "./screen/CartScreen.jsx";
import SignUpScreen from "./screen/SignUpScreen.jsx";
import LoginScreen from "./screen/LoginScreen.jsx";
import "font-awesome/css/font-awesome.min.css"; // Add this line
import ContectScreen from "./screen/ContectScreen.jsx";
import CheckoutForm from "./screen/ChackoutScreen.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderScreen from "./screen/OrderScreen.jsx";
import OrderDetailScreen from "./screen/OrderDetailScreen.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminProduct from "./admin/AdminProduct.jsx";
import AllUser from "./admin/AllUser.jsx";
import AddProduct from "./admin/AddProduct.jsx";
import ForgotPassword from "./screen/ForgotPassword.jsx";
import ResetPassword from "./screen/ResetPassword.jsx";
import AdminOrderDetail from "./admin/AdminOrderDetail.jsx";
import AdminOrderList from "./admin/AdminOrder.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "products/:id", element: <ProductDetails /> },
      { path: "/cart", element: <CartScreen /> },
      { path: "/signup", element: <SignUpScreen /> },
      { path: "/login", element: <LoginScreen /> },
      { path: "/contect", element: <ContectScreen /> },
      { path: "/chackout", element: <CheckoutForm /> },
      { path: "/order", element: <OrderScreen /> },
      { path: "/order/:id", element: <OrderDetailScreen /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password/:token", element: <ResetPassword /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "product", element: <AdminProduct /> },
      { path: "addproduct", element: <AddProduct /> },
      { path: "AllUser", element: <AllUser /> },
      { path: "orders", element: <AdminOrderList /> },
      { path: "order/:id", element: <AdminOrderDetail /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer />
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
