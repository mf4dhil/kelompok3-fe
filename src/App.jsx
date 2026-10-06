import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Produk from './pages/Produk';
import ProdukAdmin from './pages/ProdukAdmin';
import DashboardAdmin from './components/layouts/DashboardAdmin';
import Users from './pages/Users';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute requiredRole='admin' />}>
          <Route element={<DashboardAdmin />}>
            <Route path='/dashboard' Component={Dashboard} />
            <Route path='/produk-admin' Component={ProdukAdmin} />
            <Route path='/users' Component={Users} />
          </Route>
        </Route>

        <Route path='/produk' Component={Produk} />
        <Route path='/login' Component={Login} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;