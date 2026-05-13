# 📚🏎️ PitStop Library Management System
A modern and responsive **Library Management System** inspired by the premium design style of Formula 1.


### Home page
<img width="952" height="467" alt="Screenshot 2026-05-13 161945" src="https://github.com/user-attachments/assets/25c8ba74-9acd-4d5e-bfae-38826268c49d" />

### Employee page
<img width="1002" height="523" alt="Screenshot 2026-05-13 162613" src="https://github.com/user-attachments/assets/ead9e4c8-adc4-41c1-ad4f-b7ce7ab53a0f" />

### Admin page
<img width="977" height="471" alt="Screenshot 2026-05-13 162750" src="https://github.com/user-attachments/assets/0dac54b5-0b67-4a86-86fe-a563fde6cbc9" />

### Student page
<img width="1079" height="462" alt="Screenshot 2026-05-13 164504" src="https://github.com/user-attachments/assets/64d760a6-b144-4b55-a7a6-452b8d245da7" />



![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![NodeJS](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)

This system helps libraries manage books, employees, students, issued books, and authentication with a clean UI and smooth experience.

---

# 🚀 Features

## 👨‍💼 Admin Portal

* Add Books
* Update Books
* Delete Books
* Manage Employees
* Manage Students
* View Dashboard Analytics
* Monitor Issued Books

## 👨‍🏫 Employee Portal

* Add Books
* Issue Books
* Return Books
* Update Book Details
* Manage Student Requests

## 👨‍🎓 User Portal

* Browse Available Books
* Search Books
* View Book Details
* Check Availability
* View Borrowing History

---

# 🛠️ Tech Stack

| Frontend   | Backend        | Database    |
| ---------- | -------------- | ----------- |
| React.js   | Node.js        | MongoDB     |
| TypeScript | Express.js     | Mongoose    |
| Vite       | REST API       | JWT         |
| CSS3       | Authentication | Cloud Ready |

---

# 🎨 UI Design

* Formula1 Inspired Layout
* Red & Blue Theme
* Responsive Design
* Shared Header & Footer
* Smooth Animations
* Modern Dashboard UI

---

# 📂 Folder Structure

```bash
pitstop-library/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
│
├── .env
├── README.md
└── package.json
```

---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/pitstop-library.git
```

## 2️⃣ Navigate Into Project

```bash
cd pitstop-library
```

## 3️⃣ Install Dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd ../server
npm install
```

---

# ▶️ Run The Project

## Start Backend Server

```bash
npm start
```

## Start Frontend

```bash
cd client
npm run dev
```

---

# 🔐 Authentication System

* Admin Login
* Employee Login
* Student Login
* JWT Authentication
* Protected Routes
* Session Management

---

# 📚 Database Models

## Book Schema

```js
const BookSchema = {
  title: String,
  author: String,
  category: String,
  quantity: Number,
  available: Boolean,
  image: String,
  createdAt: Date
}
```

## User Schema

```js
const UserSchema = {
  name: String,
  email: String,
  password: String,
  role: String
}
```

---

# 🧩 Main Functionalities

| Feature           | Status |
| ----------------- | ------ |
| Add Book          | ✅      |
| Update Book       | ✅      |
| Delete Book       | ✅      |
| Search Book       | ✅      |
| User Login        | ✅      |
| Employee Login    | ✅      |
| Admin Dashboard   | ✅      |
| Book Issue System | ✅      |
| Return System     | ✅      |

---

# 🌐 API Endpoints

## Books

```http
GET /api/books
POST /api/books
PUT /api/books/:id
DELETE /api/books/:id
```

## Authentication

```http
POST /api/auth/login
POST /api/auth/register
```

## Users

```http
GET /api/users
DELETE /api/users/:id
```

---

# 🎯 Home Page Features

* Hero Banner
* Featured Books Section
* Latest Arrivals
* Search Bar
* Responsive Navigation
* Footer with Quick Links

---

# 📸 UI Pages

| Page            | Description                 |
| --------------- | --------------------------- |
| Home Page       | Display books from database |
| User Portal     | Student dashboard           |
| Employee Portal | Staff operations            |
| Admin Portal    | Full system management      |
| Login Page      | Authentication system       |

---

# 🏎️ Formula1 Inspired Design

Inspired from:

* Dynamic Layouts
* Fast UI Interactions
* Premium Typography
* Bold Red Theme
* Professional Dashboard Styling

---

# 🔥 Future Enhancements

* AI Book Recommendation
* Barcode Scanner
* QR Based Issue System
* Online Reservation
* Dark Mode
* Email Notifications
* Fine Calculation
* Mobile App Version

---

# 🧪 Sample React Component

```jsx
function BookCard({ book }) {
  return (
    <div className="book-card">
      <img src={book.image} alt={book.title} />
      <h2>{book.title}</h2>
      <p>{book.author}</p>
      <button>View Details</button>
    </div>
  )
}

export default BookCard
```

---

# 🎨 Sample CSS Theme

```css
body {
  background: #0f172a;
  color: white;
  font-family: Arial, sans-serif;
}

button {
  background: red;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
}

button:hover {
  background: blue;
}
```

---

# 📈 System Workflow

```text
Admin → Manage Employees & Books
Employee → Issue / Return Books
Student → Search & Borrow Books
Database → Stores All Records
```

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Developed By

## Laxmi

> “Where Speed Meets Knowledge.” 📚🏎️

---




