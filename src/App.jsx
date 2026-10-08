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
import LaporanPage from './pages/LaporanPage';
import ProtectedRoute from './components/ProtectedRoute';
import Pelanggan from './pages/Pelanggan';

// Material & Inventory
import MaterialsPage from './pages/materials/MaterialsPage';
import LowStockPage from './pages/materials/LowStockPage';
import MaterialDetailPage from './pages/materials/MaterialDetailPage';
import PurchasesPage from './pages/materials/PurchasesPage';
import PurchaseDetailPage from './pages/materials/PurchaseDetailPage';
import PurchaseCreatePage from './pages/materials/PurchaseCreatePage';

// Expense
import ExpenseCategoriesPage from './pages/expenses/ExpenseCategoriesPage';
import ExpensesPage from './pages/expenses/ExpensesPage';
import ExpenseCreatePage from './pages/expenses/ExpenseCreatePage';
import ExpenseDetailPage from './pages/expenses/ExpenseDetailPage';

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
            <Route path='/laporan' Component={LaporanPage} />
            <Route path='/pelanggan' Component={Pelanggan} />
            
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
            
            {/* Material & Inventory Routes */}
            <Route path='/materials' Component={MaterialsPage} />
            <Route path='/materials/low-stock' Component={LowStockPage} />
            <Route path='/materials/:id' Component={MaterialDetailPage} />
            <Route path='/material-purchases' Component={PurchasesPage} />
            <Route path='/material-purchases/:id' Component={PurchaseDetailPage} />
            <Route path='/material-purchases/create' Component={PurchaseCreatePage} />
            
            {/* Expense Routes */}
            <Route path='/expense-categories' Component={ExpenseCategoriesPage} />
            <Route path='/expenses' Component={ExpensesPage} />
            <Route path='/expenses/create' Component={ExpenseCreatePage} />
            <Route path='/expenses/:id' Component={ExpenseDetailPage} />
          </Route>
        </Route>
        
        <Route path='/produk' Component={Produk} />
        <Route path='/login' Component={Login} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;