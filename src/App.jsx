import { BrowserRouter, Route, Routes } from "react-router-dom"
// import HomePage from "../../../loan-book/frontend/src/pages/HomePage"
import Login from "./pages/Login"


function App() {
  
  return (
    <BrowserRouter>
      <Routes >
        {/* <Route path='/' Component={HomePage} /> */}
        <Route path='/login' Component={Login} />
        {/* <Route path='/dashboard' Component={HomePage} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
