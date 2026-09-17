import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Shop from './components/Shop';
import Cart from './components/Cart';
import './App.css';

function App() {
  const [view, setView] = useState('shop');

  return (
    <CartProvider>
      <div className="app">
        <Header view={view} setView={setView} />
        <main className="main-content">
          {view === 'shop' ? <Shop /> : <Cart />}
        </main>
        <footer className="footer">
          <p>Mini E-Commerce &copy; 2026 — Contoh aplikasi Node.js + React + MySQL</p>
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;
