import { Route, Routes } from "react-router-dom"
import HomePage from "../../../loan-book/frontend/src/pages/HomePage"


function App() {
  
  return (
    <BrowserRouter>
      <Routes >
        <Route path='/' Component={HomePage} />
        <Route path='/login' Component={HomePage} />
        <Route path='/dashboard' Component={HomePage} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
