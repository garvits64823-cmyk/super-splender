require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const db = require("./database");
const { NotificationService } = require("./notificationService");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Generate random OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Validation middleware
const validateEmail = body("email")
  .isEmail()
  .withMessage("Invalid email format");
const validatePhone = body("phone")
  .isMobilePhone()
  .withMessage("Invalid phone number format");

// Send OTP endpoint
app.post(
  "/api/send-otp",
  [
    body("identifier").notEmpty().withMessage("Email or phone is required"),
    body("type")
      .isIn(["email", "phone"])
      .withMessage("Type must be email or phone"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { identifier, type } = req.body;

    // Validate format based on type
    if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (type === "phone" && !/^\+?[\d\s-()]{10,}$/.test(identifier)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    // Check retry limits
    db.get(
      `SELECT * FROM otps WHERE identifier = ? AND createdAt > datetime('now', '-1 hour')`,
      [identifier],
      (err, row) => {
        if (row && row.attempts >= 3) {
          return res
            .status(429)
            .json({ error: "Too many attempts. Try again later." });
        }

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        db.run(
          `INSERT OR REPLACE INTO otps (identifier, otp, expiresAt, attempts) VALUES (?, ?, ?, 0)`,
          [identifier, otp, expiresAt.toISOString()],
          async (err) => {
            if (err) {
              return res.status(500).json({ error: "Failed to send OTP" });
            }

            // Send notification
            try {
              console.log(`🔄 Sending ${type} OTP to ${identifier}`);
              const result = await NotificationService.sendOTP(
                identifier,
                otp,
                type
              );
              console.log(`📤 Notification result:`, result);
            } catch (notifErr) {
              console.error("❌ Notification error:", notifErr);
            }

            console.log(`OTP for ${identifier}: ${otp}`);
            res.json({ message: "OTP sent successfully", otp }); // Remove otp in production
          }
        );
      }
    );
  }
);

// Verify OTP endpoint
app.post("/api/verify-otp", (req, res) => {
  const { identifier, otp } = req.body;

  db.get(
    `SELECT * FROM otps WHERE identifier = ? ORDER BY createdAt DESC LIMIT 1`,
    [identifier],
    (err, row) => {
      if (!row) {
        return res.status(400).json({ error: "OTP not found" });
      }

      if (new Date() > new Date(row.expiresAt)) {
        return res.status(400).json({ error: "OTP expired" });
      }

      if (row.otp !== otp) {
        db.run(`UPDATE otps SET attempts = attempts + 1 WHERE id = ?`, [
          row.id,
        ]);
        return res.status(400).json({ error: "Invalid OTP" });
      }

      // Check if user exists
      db.get(
        `SELECT * FROM users WHERE email = ? OR phone = ?`,
        [identifier, identifier],
        (err, user) => {
          const token = jwt.sign({ identifier }, process.env.JWT_SECRET, {
            expiresIn: "24h",
          });

          if (user) {
            res.json({
              message: "Login successful",
              token,
              user: { name: user.name, email: user.email, phone: user.phone },
              isNewUser: false,
            });
          } else {
            res.json({
              message: "OTP verified",
              token,
              isNewUser: true,
            });
          }
        }
      );
    }
  );
});

// Complete registration
app.post("/api/complete-registration", (req, res) => {
  const { token, name, dateOfBirth, email, phone, loginMethod } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // Get next user number and increment counter
  db.get(`SELECT next_number FROM user_counter WHERE id = 1`, (err, row) => {
    if (err || !row) {
      console.error("Counter error:", err);
      // Fallback: insert without user_number, will be assigned later
      db.run(
        `INSERT INTO users (email, phone, name, dateOfBirth, loginMethod) VALUES (?, ?, ?, ?, ?)`,
        [email, phone, name, dateOfBirth, loginMethod],
        async function (err) {
          if (err) {
            console.error("Registration error:", err);
            return res.status(500).json({ error: "Registration failed" });
          }

          // Send welcome notification
          try {
            await NotificationService.sendWelcomeMessage(email, name, "email");
            await NotificationService.sendWelcomeMessage(phone, name, "phone");
          } catch (notifErr) {
            console.error("Welcome notification error:", notifErr);
          }

          const newToken = jwt.sign(
            { userId: this.lastID },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
          );
          res.json({
            message: "Registration completed",
            token: newToken,
            user: { name, email, phone },
          });
        }
      );
      return;
    }

    const userNumber = row.next_number;

    // Insert user with user_number
    db.run(
      `INSERT INTO users (user_number, email, phone, name, dateOfBirth, loginMethod) VALUES (?, ?, ?, ?, ?, ?)`,
      [userNumber, email, phone, name, dateOfBirth, loginMethod],
      async function (err) {
        if (err) {
          console.error("Registration error:", err);
          return res.status(500).json({ error: "Registration failed" });
        }

        // Increment counter for next user
        db.run(
          `UPDATE user_counter SET next_number = next_number + 1 WHERE id = 1`
        );

        // Send welcome notification
        try {
          await NotificationService.sendWelcomeMessage(email, name, "email");
          await NotificationService.sendWelcomeMessage(phone, name, "phone");
        } catch (notifErr) {
          console.error("Welcome notification error:", notifErr);
        }

        const newToken = jwt.sign(
          { userId: this.lastID },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        res.json({
          message: "Registration completed",
          token: newToken,
          user: { name, email, phone },
        });
      }
    );
  });
});

// User middleware
const userAuth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", decoded); // Debug log

    if (!decoded.userId && !decoded.identifier && !decoded.adminId) {
      console.log("No userId, identifier, or adminId in token");
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Token verification error:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Update user profile
app.put("/api/update-profile", userAuth, (req, res) => {
  const { name, dateOfBirth } = req.body;
  console.log("Profile update request:", { name, dateOfBirth, user: req.user });

  if (!name || !dateOfBirth) {
    console.log("Missing name or dateOfBirth");
    return res
      .status(400)
      .json({ error: "Name and date of birth are required" });
  }

  // Handle userId, identifier, or adminId
  let whereClause, params;
  if (req.user.userId) {
    console.log("Using userId:", req.user.userId);
    whereClause = "id = ?";
    params = [name.trim(), dateOfBirth, req.user.userId];
  } else if (req.user.identifier) {
    console.log("Using identifier:", req.user.identifier);
    whereClause = "email = ? OR phone = ?";
    params = [
      name.trim(),
      dateOfBirth,
      req.user.identifier,
      req.user.identifier,
    ];
  } else if (req.user.adminId) {
    console.log("Admin trying to update profile - not allowed");
    return res
      .status(400)
      .json({
        error: "Admin cannot update user profile. Please login as a user.",
      });
  } else {
    console.log("No valid user identifier found");
    return res.status(400).json({ error: "Invalid user token" });
  }

  console.log(
    "SQL Query:",
    `UPDATE users SET name = ?, dateOfBirth = ? WHERE ${whereClause}`
  );
  console.log("SQL Params:", params);

  db.run(
    `UPDATE users SET name = ?, dateOfBirth = ? WHERE ${whereClause}`,
    params,
    function (err) {
      if (err) {
        console.error("Profile update error:", err);
        return res.status(500).json({ error: "Failed to update profile" });
      }

      console.log("Rows changed:", this.changes);
      if (this.changes === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "Profile updated successfully" });
    }
  );
});

// Admin login
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM admins WHERE email = ?`, [email], (err, admin) => {
    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ message: "Admin login successful", token });
  });
});

// Admin middleware
const adminAuth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.adminId) {
      return res.status(401).json({ error: "Admin access required" });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Get all users (Admin only)
app.get("/api/admin/users", adminAuth, (req, res) => {
  const { search, filter } = req.query;
  let query = `SELECT * FROM users WHERE 1=1`;
  let params = [];

  if (search) {
    query += ` AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (filter === "email") {
    query += ` AND email IS NOT NULL`;
  } else if (filter === "phone") {
    query += ` AND phone IS NOT NULL`;
  }

  query += ` ORDER BY createdAt DESC`;

  db.all(query, params, (err, users) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch users" });
    }
    res.json(users);
  });
});

// Block/Unblock user
app.patch("/api/admin/users/:id/block", adminAuth, (req, res) => {
  const { id } = req.params;
  const { isBlocked } = req.body;

  db.run(
    `UPDATE users SET isBlocked = ? WHERE id = ?`,
    [isBlocked ? 1 : 0, id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update user status" });
      }
      res.json({
        message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
      });
    }
  );
});

// Delete user account
app.delete("/api/admin/users/:id", adminAuth, (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Failed to delete user" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User account deleted successfully" });
  });
});

// Get company information
app.get("/api/company-info", (req, res) => {
  db.get(`SELECT * FROM company_info WHERE id = 1`, (err, row) => {
    if (err || !row) {
      return res.json({
        name: "Your Company Name",
        logo: "/default-logo.png",
      });
    }
    res.json(row);
  });
});

// Update company information (Admin only)
app.post("/api/admin/company-info", adminAuth, (req, res) => {
  console.log("Company update request body:", req.body);
  const { name } = req.body;

  if (!name || !name.trim()) {
    console.log("Company name validation failed:", name);
    return res.status(400).json({ error: "Company name is required" });
  }

  console.log("Updating company name to:", name.trim());
  db.run(
    `INSERT OR REPLACE INTO company_info (id, name, logo) VALUES (1, ?, ?)`,
    [name.trim(), "/default-logo.png"],
    function (err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to update company info" });
      }

      console.log("Company info updated successfully");
      res.json({ message: "Company information updated successfully" });
    }
  );
});

// Create food order
app.post(
  "/api/food-order",
  userAuth,
  upload.single("orderImage"),
  async (req, res) => {
    const { pickupLocation, dropLocation, restaurantName, orderDescription } =
      req.body;

    // Validation
    if (!pickupLocation || !dropLocation || !restaurantName) {
      return res
        .status(400)
        .json({
          error:
            "Pickup location, drop location, and restaurant name are required",
        });
    }

    if (!orderDescription && !req.file) {
      return res
        .status(400)
        .json({ error: "Please provide order description or upload an image" });
    }

    let imageUrl = null;

    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { resource_type: "image", folder: "food_orders" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(req.file.buffer);
        });
        imageUrl = result.secure_url;
      } catch (error) {
        console.error("Image upload error:", error);
        return res.status(500).json({ error: "Failed to upload image" });
      }
    }

    // Get user ID from token
    let userId = null;
    if (req.user.userId) {
      userId = req.user.userId;
    } else if (req.user.identifier) {
      // Get user ID from identifier
      const user = await new Promise((resolve, reject) => {
        db.get(
          `SELECT id FROM users WHERE email = ? OR phone = ?`,
          [req.user.identifier, req.user.identifier],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });
      userId = user ? user.id : null;
    }

    if (!userId) {
      return res.status(400).json({ error: "User not found" });
    }

    // Insert order into database
    db.run(
      `INSERT INTO food_orders (user_id, pickup_location, drop_location, restaurant_name, order_description, order_image) 
          VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        pickupLocation,
        dropLocation,
        restaurantName,
        orderDescription,
        imageUrl,
      ],
      function (err) {
        if (err) {
          console.error("Order creation error:", err);
          return res.status(500).json({ error: "Failed to create order" });
        }

        res.json({
          message: "Food order placed successfully",
          orderId: this.lastID,
        });
      }
    );
  }
);

// Create grocery order
app.post(
  "/api/grocery-order",
  userAuth,
  upload.single("groceryImage"),
  async (req, res) => {
    const { shopLocation, dropLocation, shopName, groceryList } = req.body;

    if (!shopLocation || !dropLocation || !shopName) {
      return res
        .status(400)
        .json({
          error: "Shop location, drop location, and shop name are required",
        });
    }

    if (!groceryList && !req.file) {
      return res
        .status(400)
        .json({ error: "Please provide grocery list or upload an image" });
    }

    let imageUrl = null;

    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { resource_type: "image", folder: "grocery_orders" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(req.file.buffer);
        });
        imageUrl = result.secure_url;
      } catch (error) {
        console.error("Image upload error:", error);
        return res.status(500).json({ error: "Failed to upload image" });
      }
    }

    let userId = null;
    if (req.user.userId) {
      userId = req.user.userId;
    } else if (req.user.identifier) {
      const user = await new Promise((resolve, reject) => {
        db.get(
          `SELECT id FROM users WHERE email = ? OR phone = ?`,
          [req.user.identifier, req.user.identifier],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });
      userId = user ? user.id : null;
    }

    if (!userId) {
      return res.status(400).json({ error: "User not found" });
    }

    db.run(
      `INSERT INTO grocery_orders (user_id, shop_location, drop_location, shop_name, grocery_list, grocery_image) 
          VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, shopLocation, dropLocation, shopName, groceryList, imageUrl],
      function (err) {
        if (err) {
          console.error("Grocery order creation error:", err);
          return res.status(500).json({ error: "Failed to create order" });
        }

        res.json({
          message: "Grocery order placed successfully",
          orderId: this.lastID,
        });
      }
    );
  }
);

// Create parcel order
app.post("/api/parcel-order", userAuth, async (req, res) => {
  const {
    pickupLocation,
    dropLocation,
    receiverName,
    receiverPhone,
    parcelDescription,
  } = req.body;

  if (
    !pickupLocation ||
    !dropLocation ||
    !receiverName ||
    !receiverPhone ||
    !parcelDescription
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let userId = null;
  if (req.user.userId) {
    userId = req.user.userId;
  } else if (req.user.identifier) {
    const user = await new Promise((resolve, reject) => {
      db.get(
        `SELECT id FROM users WHERE email = ? OR phone = ?`,
        [req.user.identifier, req.user.identifier],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
    userId = user ? user.id : null;
  }

  if (!userId) {
    return res.status(400).json({ error: "User not found" });
  }

  db.run(
    `INSERT INTO parcel_orders (user_id, pickup_location, drop_location, receiver_name, receiver_phone, parcel_description) 
          VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userId,
      pickupLocation,
      dropLocation,
      receiverName,
      receiverPhone,
      parcelDescription,
    ],
    function (err) {
      if (err) {
        console.error("Parcel order creation error:", err);
        return res.status(500).json({ error: "Failed to create order" });
      }

      res.json({
        message: "Parcel order placed successfully",
        orderId: this.lastID,
      });
    }
  );
});

// Create bike taxi order
app.post("/api/bike-taxi-order", userAuth, async (req, res) => {
  const { pickupLocation, dropLocation } = req.body;

  if (!pickupLocation || !dropLocation) {
    return res
      .status(400)
      .json({ error: "Pickup and drop locations are required" });
  }

  let userId = null;
  if (req.user.userId) {
    userId = req.user.userId;
  } else if (req.user.identifier) {
    const user = await new Promise((resolve, reject) => {
      db.get(
        `SELECT id FROM users WHERE email = ? OR phone = ?`,
        [req.user.identifier, req.user.identifier],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
    userId = user ? user.id : null;
  }

  if (!userId) {
    return res.status(400).json({ error: "User not found" });
  }

  db.run(
    `INSERT INTO bike_taxi_orders (user_id, pickup_location, drop_location) 
          VALUES (?, ?, ?)`,
    [userId, pickupLocation, dropLocation],
    function (err) {
      if (err) {
        console.error("Bike taxi order creation error:", err);
        return res.status(500).json({ error: "Failed to create order" });
      }

      res.json({
        message: "Bike taxi booked successfully",
        orderId: this.lastID,
      });
    }
  );
});

// Get service pricing
app.get('/api/service-pricing/:serviceId', (req, res) => {
  const { serviceId } = req.params;
  
  db.get(`SELECT * FROM service_pricing WHERE service_id = ?`, [serviceId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch pricing' });
    }
    if (!row) {
      return res.json({ fixed_price: 20, per_minute_price: 2, additional_time: 0 });
    }
    res.json(row);
  });
});

// Get all service pricing (Admin)
app.get('/api/admin/service-pricing', adminAuth, (req, res) => {
  db.all(`SELECT sp.service_id, sp.fixed_price, sp.per_minute_price, sp.additional_time, s.name, s.icon 
          FROM service_pricing sp 
          JOIN services s ON sp.service_id = s.id 
          WHERE sp.service_id IN (1, 2, 3, 4) 
          GROUP BY sp.service_id`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch pricing' });
    }
    res.json({ data: rows });
  });
});

// Update service pricing (Admin)
app.put('/api/admin/service-pricing/:serviceId', adminAuth, (req, res) => {
  const { serviceId } = req.params;
  const { fixed_price, per_minute_price, additional_time } = req.body;
  
  if (fixed_price === undefined || per_minute_price === undefined) {
    return res.status(400).json({ error: 'Fixed price and per minute price are required' });
  }

  db.run(`UPDATE service_pricing SET fixed_price = ?, per_minute_price = ?, additional_time = ?, updated_at = CURRENT_TIMESTAMP 
          WHERE service_id = ?`,
    [fixed_price, per_minute_price, additional_time || 0, serviceId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update pricing' });
      }
      res.json({ message: 'Pricing updated successfully' });
    }
  );
});

// Public profile endpoint (no auth required)
app.get('/api/public/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Get user info
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT user_number, name, createdAt FROM users WHERE user_number = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user orders
    const orders = [];
    const queries = [
      { table: 'food_orders', type: 'food-delivery' },
      { table: 'grocery_orders', type: 'grocery-pickup' },
      { table: 'parcel_orders', type: 'parcel-drop' },
      { table: 'bike_taxi_orders', type: 'bike-taxi' }
    ];

    // Get internal user ID
    const internalUser = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE user_number = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (internalUser) {
      for (const query of queries) {
        const rows = await new Promise((resolve, reject) => {
          db.all(`SELECT id, status, created_at, '${query.type}' as service_type FROM ${query.table} WHERE user_id = ? ORDER BY created_at DESC`, 
            [internalUser.id], (err, rows) => {
              if (err) reject(err);
              else resolve(rows || []);
            });
        });
        orders.push(...rows);
      }
    }

    orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.json({ user, orders });
  } catch (error) {
    console.error('Public profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Send password reset OTP
app.post("/api/send-reset-otp", (req, res) => {
  const { identifier, type } = req.body;

  // Check if user exists
  db.get(
    `SELECT * FROM users WHERE email = ? OR phone = ?`,
    [identifier, identifier],
    (err, user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check retry limits
      db.get(
        `SELECT * FROM otps WHERE identifier = ? AND createdAt > datetime('now', '-1 hour')`,
        [identifier],
        (err, row) => {
          if (row && row.attempts >= 3) {
            return res
              .status(429)
              .json({ error: "Too many attempts. Try again later." });
          }

          const otp = generateOTP();
          const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

          db.run(
            `INSERT OR REPLACE INTO otps (identifier, otp, expiresAt, attempts) VALUES (?, ?, ?, 0)`,
            [identifier, otp, expiresAt.toISOString()],
            async (err) => {
              if (err) {
                return res
                  .status(500)
                  .json({ error: "Failed to send reset OTP" });
              }

              // Send reset notification
              try {
                await NotificationService.sendPasswordResetOTP(
                  identifier,
                  otp,
                  type
                );
              } catch (notifErr) {
                console.error("Reset notification error:", notifErr);
              }

              console.log(`Reset OTP for ${identifier}: ${otp}`);
              res.json({ message: "Reset OTP sent successfully" });
            }
          );
        }
      );
    }
  );
});

// Verify password reset OTP
app.post("/api/verify-reset-otp", (req, res) => {
  const { identifier, otp } = req.body;

  db.get(
    `SELECT * FROM otps WHERE identifier = ? ORDER BY createdAt DESC LIMIT 1`,
    [identifier],
    (err, row) => {
      if (!row) {
        return res.status(400).json({ error: "OTP not found" });
      }

      if (new Date() > new Date(row.expiresAt)) {
        return res.status(400).json({ error: "OTP expired" });
      }

      if (row.otp !== otp) {
        db.run(`UPDATE otps SET attempts = attempts + 1 WHERE id = ?`, [
          row.id,
        ]);
        return res.status(400).json({ error: "Invalid OTP" });
      }

      res.json({ message: "Reset OTP verified successfully" });
    }
  );
});

// Reset password
app.post("/api/reset-password", (req, res) => {
  const { identifier, otp, newPassword } = req.body;

  // Verify OTP again
  db.get(
    `SELECT * FROM otps WHERE identifier = ? ORDER BY createdAt DESC LIMIT 1`,
    [identifier],
    (err, row) => {
      if (!row || row.otp !== otp || new Date() > new Date(row.expiresAt)) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }

      // Hash new password
      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      // Update user password
      db.run(
        `UPDATE users SET password = ? WHERE email = ? OR phone = ?`,
        [hashedPassword, identifier, identifier],
        function (err) {
          if (err) {
            return res.status(500).json({ error: "Failed to reset password" });
          }

          if (this.changes === 0) {
            return res.status(404).json({ error: "User not found" });
          }

          // Delete used OTP
          db.run(`DELETE FROM otps WHERE identifier = ?`, [identifier]);

          res.json({ message: "Password reset successfully" });
        }
      );
    }
  );
});
