import {  Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import AddUser from './pages/admin/AddUser';
import AddProduct from './pages/admin/AddProduct';
import Navbar from './components/Navbar';
import './index.css';
import ProductsPage from './pages/ProductsPage';
import Mainpage from './pages/emplyee/Mainpage';
import AdminMain from './pages/admin/AdminMain';
import Order from './components/Order';
function App() {
  return (

      <Routes>
        <Route path="/"  element={<Login />} />
        <Route path="/AddUser" element={< AddUser/>} />
        <Route path="/AddProduct" element={< AddProduct/>} />
        <Route path="/Navbar" element={< Navbar/>} />
        <Route path="/ProductsPage" element={< ProductsPage/>} />
        <Route path="/Mainpage" element={< Mainpage/>} />
        <Route path="/AdminMain" element={< AdminMain/>} />
        <Route path="/Order" element={< Order/>} />
      </Routes>


  );
}
export default App
