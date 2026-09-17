-- Schema untuk Mini E-Commerce
-- Jalankan: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS mini_ecommerce CHARACTER SET utf8mb4;
USE mini_ecommerce;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  image_url VARCHAR(500),
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(150) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  qty INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Data contoh
INSERT INTO categories (name) VALUES ('Elektronik'), ('Pakaian'), ('Aksesoris');

INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
('Headphone Wireless', 'Headphone bluetooth kualitas suara jernih', 250000, 25, 'https://picsum.photos/seed/headphone/400/300', 1),
('Kaos Polos Premium', 'Kaos katun combed 30s, nyaman dipakai', 85000, 50, 'https://picsum.photos/seed/kaos/400/300', 2),
('Smartwatch X1', 'Jam tangan pintar dengan fitur kesehatan', 450000, 15, 'https://picsum.photos/seed/smartwatch/400/300', 1),
('Tas Selempang Kulit', 'Tas kulit sintetis anti air', 175000, 30, 'https://picsum.photos/seed/tas/400/300', 3),
('Celana Jeans Slimfit', 'Celana jeans model slimfit, bahan stretch', 195000, 40, 'https://picsum.photos/seed/jeans/400/300', 2),
('Powerbank 10000mAh', 'Powerbank fast charging kapasitas besar', 135000, 60, 'https://picsum.photos/seed/powerbank/400/300', 1);
