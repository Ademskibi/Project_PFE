import {  Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import AddUser from './pages/AddUser';
import AddProduct from './pages/AddProduct';
import './index.css';

function App() {
  return (

      <Routes>
        <Route path="/"  element={<Login />} />
        <Route path="/AddUser" element={< AddUser/>} />
        <Route path="/AddProduct" element={< AddProduct/>} />
      </Routes>

  );
}
export default App
