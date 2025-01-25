import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { apiurl } from "../../url";

const initialState = {
  user: [],

  userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = {
        userId: action.payload.userId,
        isAdmin: action.payload.isAdmin,
      };
      state.token = action.payload.token;
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
      localStorage.setItem("token", action.payload.token);
      toast.success("Login successful!");
    },
    signupSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = {
        userId: action.payload.userId,
        isAdmin: action.payload.isAdmin,
      };
      state.token = action.payload.token;
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
      localStorage.setItem("token", action.payload.token);
      toast.success("Signup successful!");
    },
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      toast.success("Logout successful!");
    },
    userFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },
    fetchUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    fetchUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },
    updateUserRoleRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserRoleSuccess: (state, action) => {
      state.loading = false;
      const index = state.user.findIndex(
        (user) => user._id === action.payload._id
      );
      if (index !== -1) {
        state.user[index] = action.payload; // Update the user with the new role
      }
      toast.success("User role updated successfully!");
    },
    updateUserRoleFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },
  },
});

export const {
  userRequest,
  loginSuccess,
  signupSuccess,
  userFail,
  logout,
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFail,
  updateUserRoleRequest,
  updateUserRoleSuccess,
  updateUserRoleFail,
} = userSlice.actions;
export default userSlice.reducer;

export const registerUser = (userData, navigate) => async (dispatch) => {
  try {
    dispatch(userRequest());

    const response = await fetch(`${apiurl}/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      dispatch(userFail(data.message));
    } else {
      dispatch(signupSuccess(data));
      navigate(data.isAdmin ? "/admin/dashboard" : "/");
    }
  } catch (error) {
    dispatch(userFail(error.message));
    throw error;
  }
};

export const loginUser = (userData, navigate) => async (dispatch) => {
  try {
    dispatch(userRequest());

    const response = await fetch(`${apiurl}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      dispatch(userFail(data.message));
    } else {
      dispatch(loginSuccess(data));
      navigate(data.isAdmin ? "/admin/dashboard" : "/");
    }
  } catch (error) {
    dispatch(userFail(error.message));
    throw error;
  }
};

export const logoutUser = () => async (dispatch) => {
  dispatch(logout());
};

export const fetchUser = () => async (dispatch) => {
  try {
    dispatch(fetchUserRequest());
    const response = await fetch(`${apiurl}/user/getall`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      dispatch(fetchUserFail(data.message));
    } else {
      dispatch(fetchUserSuccess(data));
    }
  } catch (error) {
    dispatch(fetchUserFail(error.message));
  }
};

export const updateUserRole = (userId, isAdmin) => async (dispatch) => {
  try {
    dispatch(userRequest());

    const response = await fetch(`${apiurl}/user/updaterole`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userId, isAdmin }),
    });

    const data = await response.json();

    if (!response.ok) {
      dispatch(userFail(data.message));
    } else {
      dispatch(fetchUser());
      toast.success("User role updated successfully!");
    }
  } catch (error) {
    dispatch(userFail(error.message));
  }
};
