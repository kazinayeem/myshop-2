# 🛒 MyShop 2.0 – Basic E-Commerce Platform | বেসিক ই-কমার্স প্ল্যাটফর্ম

## 📦 Project Overview | প্রকল্পের সারসংক্ষেপ

Welcome to **MyShop 2.0** – a simple yet powerful e-commerce platform for small businesses and individual sellers. This project supports full e-commerce functionality including product browsing, cart management, order processing, user account management, and admin dashboard.  

**MyShop 2.0** একটি সম্পূর্ণ ফিচারসমৃদ্ধ অনলাইন শপিং প্ল্যাটফর্ম যেখানে ইউজাররা প্রোডাক্ট ব্রাউজ করতে, অর্ডার দিতে এবং নিজের অ্যাকাউন্ট ও অর্ডার ম্যানেজ করতে পারবেন। অ্যাডমিনরা প্রোডাক্ট, অর্ডার এবং রিপোর্ট ম্যানেজ করতে পারবেন।

---

## ✨ Key Features | প্রধান বৈশিষ্ট্য

### 👨‍💼 Admin Panel Features | অ্যাডমিন ফিচারসমূহ

- 🔐 Admin Login (No registration required)
- ➕ Add New Product
- ✏️ Edit and Update Existing Products
- 🔍 Search Products by Name or ID
- 📁 Category Management (Add, Edit, Delete, View)
- 🗂️ Subcategory Management (Edit, Show, Delete)
- 🏷️ Brand Management (Add name and image)
- 📊 Profit & Loss Calculation
- 📋 View All Orders & Change Order Status
- 🧾 Generate Invoice for Customers
- 👤 View All Registered Users
- 📦 Filter Products by Category
- ⏲️ **Auto Delete Failed Orders after 30 Minutes** ✅

### 👤 User Panel Features | ইউজার ফিচারসমূহ

- 📝 User Registration & Login
- 🧾 View and Manage Orders
- 🛒 Add Products to Cart
- 📦 Place Orders Easily
- 🔍 Product Search with Filters:
  - Category
  - Brand
  - Subcategory
  - Price Range
- 🏠 Address Management:
  - Add up to 5 Addresses
  - Edit/Delete Address
- ⚙️ Edit Profile Information
- 📜 View Order History and Details
- 📄 Product Details Page
- 💳 Multiple Payment Options via **SSLCommerz**:
  - bKash
  - Nagad
  - Bank
  - Cards
  - Others
- 💵 **Cash on Delivery (COD) Support** ✅
- 🚚 **Auto Delivery Charge Based on Location** ✅

---

## 🧠 Smart System Features | স্মার্ট ফিচারসমূহ

- 🕒 **Auto Delete for Failed Orders:**
  - If an order is not completed within 30 minutes, it is auto-deleted to keep the system clean.
  - ✅ Cron Job or Scheduled Task-based Implementation.

- 🚛 **Auto Delivery Charge Based on Location:**
  - System automatically calculates delivery fee depending on user’s selected address.
  - Example:
    - Inside Dhaka: ৳60
    - Outside Dhaka: ৳120

- 🔐 Authentication:
  - JWT Token-based Secure Login
  - Password Hashing with Bcrypt

---

## ⚙️ Technologies Used | ব্যবহৃত টেকনোলজি

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Authentication:** JWT, bcrypt
- **Payment Gateway:** SSLCommerz
- **Task Scheduling:** node-cron or custom timer logic

---

## 🛠 Installation Guide | ইনস্টলেশন নির্দেশিকা

### 📌 Prerequisites | পূর্বশর্ত

- ✅ Node.js v18 or above
- ✅ npm v8 or above
- ✅ MongoDB (local or Atlas)

### 📥 Installation Steps | ইনস্টলেশন ধাপসমূহ

```bash
# Clone the repository
git clone https://github.com/kazinayeem/myshop-2.git
cd myshop-2

# Install dependencies
npm install

# Run the server
npm start
