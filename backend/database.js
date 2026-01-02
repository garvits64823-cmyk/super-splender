const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./database.db');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_number INTEGER UNIQUE,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    name TEXT,
    dateOfBirth TEXT,
    loginMethod TEXT,
    isBlocked INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Add user_number column if it doesn't exist (without UNIQUE constraint initially)
  db.run(`ALTER TABLE users ADD COLUMN user_number INTEGER`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Error adding user_number column:', err);
    }
  });

  // User counter table to track the next user number
  db.run(`CREATE TABLE IF NOT EXISTS user_counter (
    id INTEGER PRIMARY KEY,
    next_number INTEGER DEFAULT 1
  )`);

  // Initialize counter if empty
  db.run(`INSERT OR IGNORE INTO user_counter (id, next_number) VALUES (1, 1)`);

  // Migrate existing users to have user_numbers
  db.get(`SELECT COUNT(*) as count FROM users WHERE user_number IS NULL`, (err, row) => {
    if (row && row.count > 0) {
      console.log(`Migrating ${row.count} existing users to have user numbers...`);
      
      db.all(`SELECT id FROM users WHERE user_number IS NULL ORDER BY id`, (err, users) => {
        if (users) {
          let userNumber = 1;
          users.forEach((user, index) => {
            db.run(`UPDATE users SET user_number = ? WHERE id = ?`, [userNumber, user.id]);
            userNumber++;
          });
          
          // Update counter to next available number
          db.run(`UPDATE user_counter SET next_number = ? WHERE id = 1`, [userNumber]);
          console.log('User migration completed.');
        }
      });
    }
  });

  // OTP table
  db.run(`CREATE TABLE IF NOT EXISTS otps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    identifier TEXT,
    otp TEXT,
    expiresAt DATETIME,
    attempts INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Admin table
  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, () => {
    // Create default admin
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT OR IGNORE INTO admins (email, password) VALUES (?, ?)`, 
      ['admin@app.com', hashedPassword]);
  });

  // Company info table
  db.run(`CREATE TABLE IF NOT EXISTS company_info (
    id INTEGER PRIMARY KEY,
    name TEXT,
    logo TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Initialize default company info
  db.run(`INSERT OR IGNORE INTO company_info (id, name, logo) VALUES (1, ?, ?)`, 
    ['Your Company Name', '/default-logo.png']);

  // Food delivery orders table
  db.run(`CREATE TABLE IF NOT EXISTS food_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    pickup_location TEXT,
    drop_location TEXT,
    restaurant_name TEXT,
    order_description TEXT,
    order_image TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`, () => {
    console.log('✅ Food orders table ready');
  });

  // Grocery orders table
  db.run(`CREATE TABLE IF NOT EXISTS grocery_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    shop_location TEXT,
    drop_location TEXT,
    shop_name TEXT,
    grocery_list TEXT,
    grocery_image TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`, () => {
    console.log('✅ Grocery orders table ready');
  });

  // Parcel orders table
  db.run(`CREATE TABLE IF NOT EXISTS parcel_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    pickup_location TEXT,
    drop_location TEXT,
    receiver_name TEXT,
    receiver_phone TEXT,
    parcel_description TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`, () => {
    console.log('✅ Parcel orders table ready');
  });

  // Bike taxi orders table
  db.run(`CREATE TABLE IF NOT EXISTS bike_taxi_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    pickup_location TEXT,
    drop_location TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`, () => {
    console.log('✅ Bike taxi orders table ready');
  });

  // Service types table
  db.run(`CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    icon TEXT,
    active INTEGER DEFAULT 1
  )`, () => {
    console.log('✅ Services table ready');
  });

  // Initialize default services
  db.run(`INSERT OR IGNORE INTO services (id, name, icon) VALUES 
    (1, 'Food Delivery', '🍔'),
    (2, 'Grocery Pickup', '🛒'),
    (3, 'Parcel Drop', '📦'),
    (4, 'Bike Taxi', '🏍️')`, () => {
    console.log('✅ Default services initialized');
  });

  // Service pricing table
  db.run(`CREATE TABLE IF NOT EXISTS service_pricing (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER,
    fixed_price REAL DEFAULT 0,
    per_minute_price REAL DEFAULT 0,
    additional_time INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services (id)
  )`, () => {
    console.log('✅ Service pricing table ready');
  });

  // Initialize default pricing
  db.run(`INSERT OR IGNORE INTO service_pricing (service_id, fixed_price, per_minute_price, additional_time) VALUES 
    (1, 25.0, 2.0, 15),
    (2, 30.0, 2.5, 15),
    (3, 20.0, 1.5, 0),
    (4, 15.0, 1.0, 0)`, () => {
    console.log('✅ Default pricing initialized');
  });
});

module.exports = db;