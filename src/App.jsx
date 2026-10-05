import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Produk from './pages/Produk';
import ProdukAdmin from './pages/ProdukAdmin';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={HomePage} />
        <Route path='/login' Component={Login} />
        <Route path='/dashboard' Component={Dashboard} />
        <Route path='/produk' Component={Produk} />
        <Route path='/produk-admin' Component={ProdukAdmin} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
