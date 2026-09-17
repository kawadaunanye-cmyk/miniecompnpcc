import { useCart } from '../context/CartContext';

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const outOfStock = product.stock <= 0;

  return (
    <div className="product-card">
      <img src={product.image_url} alt={product.name} className="product-image" loading="lazy" />
      <div className="product-body">
        <span className="product-category">{product.category_name || 'Umum'}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">{formatRupiah(product.price)}</span>
          <span className="product-stock">Stok: {product.stock}</span>
        </div>
        <button
          className="btn btn-primary"
          disabled={outOfStock}
          onClick={() => addToCart(product)}
        >
          {outOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
        </button>
      </div>
    </div>
  );
}
