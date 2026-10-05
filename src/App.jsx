import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
// import HomePage from "../pages/HomePage"
// import Dashboard from "../pages/Dashboard"
// import Login from "../pages/Login"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={HomePage} />
        <Route path='/login' Component={Login} />
        <Route path='/dashboard' Component={Dashboard} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
