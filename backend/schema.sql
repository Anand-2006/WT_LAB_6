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
('The Hobbit', 'J.R.R. Tolkien', 380.00, 18, 1, 'https://covers.openlibrary.org/b/isbn/0261102217-L.jpg', 'A reluctant hobbit sets out on an unexpected journey.'),
('To Kill a Mockingbird', 'Harper Lee', 340.00, 22, 1, 'https://covers.openlibrary.org/b/isbn/0061120081-L.jpg', 'A story of racial injustice in the American South.'),
('The Great Gatsby', 'F. Scott Fitzgerald', 299.00, 20, 1, 'https://covers.openlibrary.org/b/isbn/0743273567-L.jpg', 'Wealth, love, and the decay of the American dream.'),
('Foundation', 'Isaac Asimov', 410.00, 14, 2, 'https://covers.openlibrary.org/b/isbn/0553293354-L.jpg', 'A mathematician predicts the fall of a galactic empire.'),
('Neuromancer', 'William Gibson', 360.00, 12, 2, 'https://covers.openlibrary.org/b/isbn/0441569595-L.jpg', 'The novel that defined the cyberpunk genre.'),
('Brave New World', 'Aldous Huxley', 320.00, 16, 2, 'https://covers.openlibrary.org/b/isbn/0060850523-L.jpg', 'A dystopia built on comfort, control, and conditioning.'),
('Educated', 'Tara Westover', 450.00, 10, 3, 'https://covers.openlibrary.org/b/isbn/0399590501-L.jpg', 'A memoir on self-invention through education.'),
('Atomic Habits', 'James Clear', 399.00, 30, 3, 'https://covers.openlibrary.org/b/isbn/0735211299-L.jpg', 'A practical guide to building better habits.'),
('Thinking, Fast and Slow', 'Daniel Kahneman', 480.00, 12, 3, 'https://covers.openlibrary.org/b/isbn/0374533555-L.jpg', 'How two systems of thought shape our judgment.'),
('Clean Code', 'Robert C. Martin', 550.00, 15, 4, 'https://covers.openlibrary.org/b/isbn/0132350882-L.jpg', 'A handbook of agile software craftsmanship.'),
('Designing Data-Intensive Applications', 'Martin Kleppmann', 650.00, 8, 4, 'https://covers.openlibrary.org/b/isbn/1449373321-L.jpg', 'The big ideas behind reliable, scalable data systems.'),
('Cracking the Coding Interview', 'Gayle Laakmann McDowell', 520.00, 25, 4, 'https://covers.openlibrary.org/b/isbn/0984782857-L.jpg', '189 programming questions and solutions.');
 