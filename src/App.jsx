import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Produk from './pages/Produk';
import ProdukAdmin from './pages/ProdukAdmin';
import DashboardAdmin from './components/layouts/DashboardAdmin';
import Users from './pages/Users';
import MasterDataPage from './pages/MasterDataPage';
import FlavorsPage from './pages/master/FlavorsPage';
import ShapesPage from './pages/master/ShapesPage';
import SizesPage from './pages/master/SizesPage';
import CategoriesPage from './pages/master/CategoriesPage';
import TypesPage from './pages/master/TypesPage';
import RekeningsPage from './pages/master/RekeningsPage';
import PreOrdersPage from './pages/PreOrdersPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route element={<ProtectedRoute requiredRole='admin' />}>
          <Route element={<DashboardAdmin />}>
            <Route path='/dashboard' Component={Dashboard} />
            <Route path='/produk-admin' Component={ProdukAdmin} />
            <Route path='/users' Component={Users} />
            <Route path='/preorder' Component={PreOrdersPage} />
            
            {/* Master Data Routes */}
            <Route path='/master-data' Component={MasterDataPage}>
              <Route path='products' Component={ProdukAdmin} />
              <Route path='flavors' Component={FlavorsPage} />
              <Route path='shapes' Component={ShapesPage} />
              <Route path='sizes' Component={SizesPage} />
              <Route path='categories' Component={CategoriesPage} />
              <Route path='types' Component={TypesPage} />
              <Route path='rekenings' Component={RekeningsPage} />
            </Route>
          </Route>
        </Route>

        <Route path='/preorder' Component={PreOrdersPage} />
        <Route path='/produk' Component={Produk} />
        <Route path='/login' Component={Login} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
