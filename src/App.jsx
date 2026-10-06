import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Produk from './pages/Produk';
import ProdukAdmin from './pages/ProdukAdmin';
import DashboardAdmin from './components/layouts/DashboardAdmin';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardAdmin />}>
          <Route path='/dashboard' Component={Dashboard} />
          <Route path='/produk-admin' Component={ProdukAdmin} />
        </Route>

        <Route path='/' Component={HomePage} />
        <Route path='/login' Component={Login} />
        <Route path='/produk' Component={Produk} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
