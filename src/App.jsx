import { Route, Routes } from "react-router-dom"
import HomePage from "../pages/HomePage"
import Dashboard from "../pages/Dashboard"


function App() {
  
  return (
    <BrowserRouter>
      <Routes >
        <Route path='/' Component={HomePage} />
        <Route path='/dashboard' Component={Dashboard} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
