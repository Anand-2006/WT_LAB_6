CREATE DATABASE IF NOT EXISTS bookstore;
USE bookstore;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer','admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(150) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  category_id INT,
  image_url VARCHAR(500),
  description TEXT,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  quantity INT DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (user_id, book_id)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending','paid','failed') DEFAULT 'pending',
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  book_id INT NOT NULL,
  quantity INT NOT NULL,
  price_at_purchase DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

INSERT INTO categories (name) VALUES ('Fiction'), ('Sci-Fi'), ('Non-Fiction'), ('Tech');

INSERT INTO books (title, author, price, stock, category_id, image_url, description) VALUES
('The Pragmatic Programmer', 'Andrew Hunt', 499.00, 20, 4, 'https://covers.openlibrary.org/b/isbn/020161622X-L.jpg', 'Classic guide to software craftsmanship.'),
('Dune', 'Frank Herbert', 350.00, 15, 2, 'https://covers.openlibrary.org/b/isbn/0441013597-L.jpg', 'Epic sci-fi saga on the desert planet Arrakis.'),
('Sapiens', 'Yuval Noah Harari', 420.00, 10, 3, 'https://covers.openlibrary.org/b/isbn/0062316095-L.jpg', 'A brief history of humankind.'),
('1984', 'George Orwell', 250.00, 25, 1, 'https://covers.openlibrary.org/b/isbn/0451524934-L.jpg', 'Dystopian classic on surveillance and control.');
