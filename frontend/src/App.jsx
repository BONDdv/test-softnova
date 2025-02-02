import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductPage from './components/ProductPage';
import CartPage from './components/CartPage';



const App = () => {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          
        </Routes>
      </div>
    </Router>
  )
}

export default App