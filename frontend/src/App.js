import { Route, Routes, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from './redux/slices/userSlice';
import { isTokenExpired } from './utils/tokenUtils';
import { clearCart } from './redux/slices/cartSlice';
import Login from './pages/Login/Login';
import AddUser from './pages/admin/AddUser';
import AddProduct from './pages/admin/AddProduct';
import Navbar from './components/Navbar';
import './index.css';
import ProductsPage from './pages/ProductsPage';
import Mainpage from './pages/emplyee/Mainpage';
import AdminMain from './pages/admin/AdminMain';
import Order from './components/Order';
import Cart from './pages/Cart';
import Orderlist from './components/Orderlist';
import Mangeorder from './pages/storekeeper/Mangeorder';
function App() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user?._id) {
        dispatch(clearCart(user._id));
      }
    }, 15 * 60 * 1000); // 15 minutes
  
    return () => clearTimeout(timeout); // Cleanup on unmount
  }, [user, dispatch]);
  

  const ProtectedRoute = ({ element }) => {
    return user ? element : <Navigate to="/" />;
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Add_User" element={<ProtectedRoute element={<AddUser />} />} />
      <Route path="/Add_Product" element={<ProtectedRoute element={<AddProduct />} />} />
      <Route path="/Navbar" element={<ProtectedRoute element={<Navbar />} />} />
      <Route path="/Products_Page" element={<ProtectedRoute element={<ProductsPage />} />} />
      <Route path="/Main_page" element={<ProtectedRoute element={<Mainpage />} />} />
      <Route path="/Admin_Main" element={<ProtectedRoute element={<AdminMain />} />} />
      <Route path="/Orders" element={<ProtectedRoute element={<Order />} />} />
      <Route path="/Cart" element={<ProtectedRoute element={<Cart />} />} />
      <Route path="/Order_list" element={<ProtectedRoute element={<Orderlist />} />} />
      <Route path="/Manage_order" element={<ProtectedRoute element={<Mangeorder />} />} />
    </Routes>
  );
}

export default App;
