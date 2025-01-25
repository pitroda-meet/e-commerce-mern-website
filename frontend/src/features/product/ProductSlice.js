import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { apiurl } from "../../url";

const initialState = {
  product: {},
  products: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    fetchProductsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess(state, action) {
      state.loading = false;
      state.products = action.payload;
    },
    fetchProductsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      toast.error(`Error: ${action.payload}`);
    },
    fetchAdminProductsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAdminProductsSuccess(state, action) {
      state.loading = false;
      state.products = action.payload;
    },
    fetchAdminProductsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      toast.error(`Error: ${action.payload}`);
    },
    fetchProductDetailsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProductDetailsSuccess(state, action) {
      state.loading = false;
      state.product = action.payload;
    },
    fetchProductDetailsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      toast.error(`Error: ${action.payload}`);
    },
    createProductStart(state) {
      state.loading = true;
      state.error = null;
    },
    createProductSuccess(state, action) {
      state.loading = false;
      state.products.push(action.payload.product);
      toast.success(action.payload.message);
    },
    createProductFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      toast.error(`Error: ${action.payload}`);
    },
    updateProductStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateProductSuccess(state, action) {
      state.loading = false;
      const index = state.products.findIndex(
        (p) => p._id === action.payload.product._id
      );
      if (index !== -1) {
        state.products[index] = action.payload.product;
      }
      toast.success(action.payload.message);
    },
    updateProductFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      toast.error(`Error: ${action.payload}`);
    },
    deleteProductStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteProductSuccess(state, action) {
      state.loading = false;
      state.products = state.products.filter(
        (p) => p._id !== action.payload.id
      );
      toast.success(action.payload.message);
    },
    deleteProductFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      toast.error(`Error: ${action.payload}`);
    },
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchAdminProductsStart,
  fetchAdminProductsSuccess,
  fetchAdminProductsFailure,
  fetchProductDetailsStart,
  fetchProductDetailsSuccess,
  fetchProductDetailsFailure,
  createProductStart,
  createProductSuccess,
  createProductFailure,
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
} = productSlice.actions;

export const fetchProducts = () => async (dispatch) => {
  dispatch(fetchProductsStart());
  try {
    const response = await fetch(`${apiurl}/products/`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    dispatch(fetchProductsSuccess(data));
  } catch (error) {
    dispatch(fetchProductsFailure(error.message));
  }
};

export const fetchAdminProducts = () => async (dispatch) => {
  dispatch(fetchAdminProductsStart());
  try {
    const response = await fetch(`${apiurl}/products/admin`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    dispatch(fetchAdminProductsSuccess(data));
  } catch (error) {
    dispatch(fetchAdminProductsFailure(error.message));
  }
};

export const fetchProductDetails = (id) => async (dispatch) => {
  dispatch(fetchProductDetailsStart());
  try {
    const response = await fetch(`${apiurl}/products/${id}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    dispatch(fetchProductDetailsSuccess(data));
  } catch (error) {
    dispatch(fetchProductDetailsFailure(error.message));
  }
};

export const createProduct = (formData) => async (dispatch) => {
  dispatch(createProductStart());
  try {
    const response = await fetch(`${apiurl}/products/admin`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    dispatch(createProductSuccess(data));
  } catch (error) {
    dispatch(createProductFailure(error.message));
  }
};

export const updateProduct =
  (id, filename, productData) => async (dispatch) => {
    dispatch(updateProductStart());
    try {
      const response = await fetch(
        `${apiurl}/products/admin/${id}/${filename}`,
        {
          method: "PUT",
          body: productData, // FormData instance
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      dispatch(updateProductSuccess(data));
    } catch (error) {
      dispatch(updateProductFailure(error.message));
    }
  };

export const deleteProduct = (id, filename) => async (dispatch) => {
  dispatch(deleteProductStart());
  try {
    const response = await fetch(`${apiurl}/products/admin/${id}/${filename}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    dispatch(deleteProductSuccess({ id, message: data.message }));
  } catch (error) {
    dispatch(deleteProductFailure(error.message));
  }
};

export default productSlice.reducer;
