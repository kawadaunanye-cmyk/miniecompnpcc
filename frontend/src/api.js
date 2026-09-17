const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Terjadi kesalahan pada server');
  }
  return data;
}

export const api = {
  getProducts: (categoryId) => {
    const query = categoryId ? `?category_id=${categoryId}` : '';
    return fetch(`${API_URL}/products${query}`).then(handleResponse);
  },
  getCategories: () => fetch(`${API_URL}/categories`).then(handleResponse),
  createOrder: (payload) =>
    fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse),
};
