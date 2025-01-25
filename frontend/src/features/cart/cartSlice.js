import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Initial state
const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

// Cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCartRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    addToCartSuccess: (state, action) => {
      state.loading = false;
      const item = action.payload.cartItem;
      const existingItem = state.cartItems.find(
        (x) => x.productId === item.productId
      );
      if (existingItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.productId === item.productId ? { ...x, quantity: item.quantity } : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
    },
    addToCartFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    removeFromCartRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    removeFromCartSuccess: (state, action) => {
      state.loading = false;
      const productId = action.payload.productId;
      state.cartItems = state.cartItems.filter(
        (item) => item.productId !== productId
      );
    },
    removeFromCartFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateCartQtyRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateCartQtySuccess: (state, action) => {
      state.loading = false;
      const updatedCartItem = action.payload.cartItem;
      state.cartItems = state.cartItems.map((item) =>
        item.productId === updatedCartItem.productId ? updatedCartItem : item
      );
    },

    updateCartQtyFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCartRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    clearCartSuccess: (state) => {
      state.loading = false;
      state.cartItems = [];
    },
    clearCartFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchProductsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false;
      state.cartItems = action.payload.cartItems;
    },
    fetchProductsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  addToCartRequest,
  addToCartSuccess,
  addToCartFail,
  removeFromCartRequest,
  removeFromCartSuccess,
  removeFromCartFail,
  updateCartQtyRequest,
  updateCartQtySuccess,
  updateCartQtyFail,
  clearCartSuccess,
  clearCartRequest,
  clearCartFail,
  fetchProductsRequest,
  fetchProductsSuccess,
  fetchProductsFail,
} = cartSlice.actions;

export default cartSlice.reducer;
export const addToCartAsync =
  ({ productId, quantity }) =>
  async (dispatch, getState) => {
    dispatch(addToCartRequest());
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userId = userInfo ? userInfo.userId : null;

      if (!userId) {
        throw new Error("User ID is required");
      }

      const response = await fetch("http://localhost:8070/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId, quantity, userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      dispatch(addToCartSuccess({ userId, cartItem: data }));
      toast.success("item  add in carts");
    } catch (error) {
      dispatch(addToCartFail(error.message));
      console.error("Error adding to cart:", error);
    }
  };
export const removeFromCartAsync =
  ({ productId }) =>
  async (dispatch) => {
    dispatch(removeFromCartRequest());
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userId = userInfo ? userInfo.userId : null;

      if (!userId) {
        throw new Error("User ID is required");
      }

      const response = await fetch(`http://localhost:8070/cart`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId, productId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      dispatch(removeFromCartSuccess({ userId, productId }));
      toast.success("Item removed from cart");
    } catch (error) {
      dispatch(removeFromCartFail(error.message));
      toast.error("Failed to remove item from cart");
      console.error("Error removing from cart:", error);
    }
  };

export const updateCartQtyAsync =
  ({ productId, quantity, userId }) =>
  async (dispatch) => {
    dispatch(updateCartQtyRequest());
    try {
      const response = await fetch(`http://localhost:8070/cart/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId, productId, quantity }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update cart item: ${response.status}`);
      }

      const data = await response.json();
      dispatch(updateCartQtySuccess({ userId, cartItem: data }));
      toast.success("Cart item updated successfully");
    } catch (error) {
      dispatch(updateCartQtyFail(error.message));
      toast.error("Failed to update cart item");
      console.error("Error updating cart item quantity:", error);
    }
  };

export const removeAllCartItem = (userId) => async (dispatch) => {
  dispatch(clearCartRequest());
  try {
    const response = await fetch(`http://localhost:8070/cart/deleteAll`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    dispatch(clearCartSuccess(data.message));
  } catch (error) {
    dispatch(clearCartFail(error.message));
    toast.error("Failed to clear cart");
    console.error("Error clearing cart:", error);
  }
};

export const fetchProductsAsync = (userId) => async (dispatch) => {
  dispatch(fetchProductsRequest());
  try {
    const response = await fetch(`http://localhost:8070/cart/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    dispatch(fetchProductsSuccess({ userId, cartItems: data.cartItems }));
  } catch (error) {
    dispatch(fetchProductsFail(error.message));
    console.error("Error fetching products:", error);
  }
};
