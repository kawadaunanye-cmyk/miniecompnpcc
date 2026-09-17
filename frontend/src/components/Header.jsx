import { useCart } from '../context/CartContext';

export default function Header({ view, setView }) {
  const { itemCount } = useCart();

  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="logo" onClick={() => setView('shop')}>
          🛍️ Mini Shop
        </h1>
        <nav>
          <button
            className={`nav-btn ${view === 'shop' ? 'active' : ''}`}
            onClick={() => setView('shop')}
          >
            Belanja
          </button>
          <button
            className={`nav-btn cart-btn ${view === 'cart' ? 'active' : ''}`}
            onClick={() => setView('cart')}
          >
            🛒 Keranjang
            {itemCount > 0 && <span className="badge">{itemCount}</span>}
          </button>
        </nav>
      </div>
    </header>
  );
}
