import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { api } from '../api';

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

export default function Cart() {
  const { items, updateQty, removeFromCart, clearCart, total } = useCart();
  const [form, setForm] = useState({ customer_name: '', customer_email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function handleCheckout(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        items: items.map((i) => ({ product_id: i.product.id, qty: i.qty })),
      };
      const res = await api.createOrder(payload);
      setResult(res);
      clearCart();
      setForm({ customer_name: '', customer_email: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="checkout-success">
        <h2>✅ Pesanan Berhasil!</h2>
        <p>Nomor Order: #{result.id}</p>
        <p>Total Bayar: {formatRupiah(result.total)}</p>
        <button className="btn btn-primary" onClick={() => setResult(null)}>
          Belanja Lagi
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <p>Keranjang belanja Anda masih kosong.</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Keranjang Belanja</h2>
      <div className="cart-items">
        {items.map(({ product, qty }) => (
          <div className="cart-item" key={product.id}>
            <img src={product.image_url} alt={product.name} className="cart-item-image" />
            <div className="cart-item-info">
              <h4>{product.name}</h4>
              <p>{formatRupiah(product.price)}</p>
            </div>
            <div className="cart-item-qty">
              <button onClick={() => updateQty(product.id, qty - 1)}>-</button>
              <span>{qty}</span>
              <button onClick={() => updateQty(product.id, qty + 1)}>+</button>
            </div>
            <p className="cart-item-subtotal">{formatRupiah(product.price * qty)}</p>
            <button className="btn-remove" onClick={() => removeFromCart(product.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <span>Total:</span>
        <span className="cart-total-amount">{formatRupiah(total)}</span>
      </div>

      <form className="checkout-form" onSubmit={handleCheckout}>
        <h3>Data Pemesan</h3>
        <input
          type="text"
          placeholder="Nama Lengkap"
          required
          value={form.customer_name}
          onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={form.customer_email}
          onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
        />
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-primary btn-checkout" type="submit" disabled={submitting}>
          {submitting ? 'Memproses...' : 'Checkout Sekarang'}
        </button>
      </form>
    </div>
  );
}
