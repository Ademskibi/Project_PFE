import {  Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Test from './pages/Login/Test';
function App() {
  return (

      <Routes>
        <Route path="/"  element={<Login />} />
        <Route path="/test" element={<Test />} />
        
      </Routes>

  );
}
export default App
