import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { weburl } from "../../URL/url";

const initialState = {
  orders: [],
  orderDetails: {},
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    fetchOrdersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    fetchOrdersFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },
    fetchOrderDetailsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrderDetailsSuccess: (state, action) => {
      state.loading = false;
      state.orderDetails = action.payload;
    },

    fetchOrderDetailsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },
    updateOrderStatusRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateOrderStatusSuccess: (state, action) => {
      state.loading = false;
      state.orderDetails = {
        ...state.orderDetails,
        ...action.payload,
      };
      state.orders = state.orders.map((order) =>
        order._id === action.payload._id ? action.payload : order
      );
      toast.success("Order status updated successfully");
    },

    updateOrderStatusFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },
  },
});

export const {
  fetchOrdersRequest,
  fetchOrdersSuccess,
  fetchOrdersFail,
  fetchOrderDetailsRequest,
  fetchOrderDetailsSuccess,
  fetchOrderDetailsFail,
  updateOrderStatusRequest,
  updateOrderStatusSuccess,
  updateOrderStatusFail,
} = orderSlice.actions;

export default orderSlice.reducer;
//this for user frontend
export const fetchOrders = (userId) => async (dispatch) => {
  try {
    dispatch(fetchOrdersRequest());
    const response = await fetch(`${weburl}/api/order/display/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      dispatch(fetchOrdersFail(data.message));
    } else {
      dispatch(fetchOrdersSuccess(data));
    }
  } catch (error) {
    dispatch(fetchOrdersFail(error.message));
  }
};

export const fetchOrderDetails = (orderId, userId) => async (dispatch) => {
  try {
    dispatch(fetchOrderDetailsRequest());
    const response = await fetch(
      `${weburl}/api/order/detail?id=${orderId}&userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      dispatch(fetchOrderDetailsFail(data.message));
    } else {
      dispatch(fetchOrderDetailsSuccess(data));
    }
  } catch (error) {
    dispatch(fetchOrderDetailsFail(error.message));
  }
};

//this for admin pannel
export const fetchAdminOrders = () => async (dispatch) => {
  try {
    dispatch(fetchOrdersRequest());
    const response = await fetch(`${weburl}/api/orderAdmin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      dispatch(fetchOrdersFail(data.message));
    } else {
      dispatch(fetchOrdersSuccess(data));
    }
  } catch (error) {
    dispatch(fetchOrdersFail(error.message));
  }
};

export const fetchAdminOrderDetails = (orderId) => async (dispatch) => {
  try {
    dispatch(fetchOrderDetailsRequest());
    const response = await fetch(`${weburl}/api/orderDetailAdmin/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      dispatch(fetchOrderDetailsFail(data.message));
    } else {
      dispatch(fetchOrderDetailsSuccess(data));
    }
  } catch (error) {
    dispatch(fetchOrderDetailsFail(error.message));
  }
};
export const updateOrderStatuss =
  (orderId, isDelivered) => async (dispatch) => {
    try {
      dispatch(updateOrderStatusRequest());
      const response = await fetch(
        `${weburl}/api/orderDetailAdmin/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ Isdelivered: isDelivered }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        dispatch(updateOrderStatusFail(data.message));
      } else {
        dispatch(updateOrderStatusSuccess(data));
      }
    } catch (error) {
      dispatch(updateOrderStatusFail(error.message));
    }
  };
