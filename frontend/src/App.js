import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "./redux/slices/cartSlice";
import Users from "./pages/admin/Users";
import Login from "./pages/Login/Login";
import AddUser from "./pages/admin/AddUser";
import AddProduct from "./pages/admin/AddProduct";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/ProductsPage";
import Mainpage from "./pages/emplyee/Mainpage";
import AdminMain from "./pages/admin/AdminMain";
import Orders from "./pages/manager/Order";
import Cart from "./pages/Cart";
import Orderlist from "./components/Orderlist";
import Mangeorder from "./pages/storekeeper/Mangeorder";
import PrivateRoute from "./components/PrivateRoute";
import NotAllowed from "./components/NotAllowed";

function App() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  // Clear cart after 15 minutes
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user?._id) {
        dispatch(clearCart(user._id));
      }
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearTimeout(timeout);
  }, [user, dispatch]);

  return (
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/home   " element={<Navigate to="/login" />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/not-allowed" element={<NotAllowed />} />

      {/* Protected routes */}
      <Route
        path="/Add_User"
        element={
          <PrivateRoute allowedRoles={["administrator"]}>
            <AddUser />
          </PrivateRoute>
        }
      />
      <Route
        path="/Users"
        element={
          <PrivateRoute allowedRoles={["administrator"]}>
            <Users />
          </PrivateRoute>
        }   />
      <Route
        path="/Add_Product"
        element={
          <PrivateRoute allowedRoles={["administrator", "storekeeper"]}>
            <AddProduct />
          </PrivateRoute>
        }
      />
      <Route
        path="/Products_Page"
        element={
          <PrivateRoute allowedRoles={["administrator", "employee", "storekeeper"]}>
            <ProductsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/Main_page"
        element={
          <PrivateRoute allowedRoles={["employee"]}>
            <Mainpage />
          </PrivateRoute>
        }
      />
      <Route
        path="/Admin_Main"
        element={
          <PrivateRoute allowedRoles={["administrator"]}>
            <AdminMain />
          </PrivateRoute>
        }
      />
      <Route
        path="/Orders"
        element={
          <PrivateRoute allowedRoles={["manager"]}>
            <Orders />
          </PrivateRoute>
        }
      />
      <Route
        path="/Cart"
        element={
          <PrivateRoute allowedRoles={["employee"]}>
            <Cart />
          </PrivateRoute>
        }
      />
      <Route
        path="/Order_list"
        element={
          <PrivateRoute allowedRoles={["administrator", "storekeeper", "manager", "employee"]}>
            <Orderlist />
          </PrivateRoute>
        }
      />
      <Route
        path="/Manage_order"
        element={
          <PrivateRoute allowedRoles={["storekeeper"]}>
            <Mangeorder />
          </PrivateRoute>
        }
      />

      {/* Catch-all fallback route */}
      <Route path="*" element={<NotAllowed />} />
    </Routes>
  );
}

export default App;