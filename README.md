# 🦢 Swan Lead Management System

A full-stack Lead Management System built for software and digital marketing companies to manage customer leads, track follow-ups, monitor lead status, and view business analytics from a centralized dashboard.

---

## 🚀 Project Overview

The Swan Lead Management System is a production-style full-stack web application designed to help businesses efficiently manage their leads.

Users can securely register and log in, create and manage leads, search and filter lead records, track lead statuses, manage follow-up dates, and monitor lead statistics through an analytics dashboard.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- JWT Authentication
- bcryptjs

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

---

## ✨ Features

### 🔐 Authentication

- User registration
- User login
- User logout
- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- Protected dashboard

### 👥 Lead Management

- Create leads
- View leads
- Update leads
- Delete leads
- Track follow-up dates
- Add notes
- Track services interested in
- Track lead status
- Track created date

### 📊 Lead Statuses

- New
- Contacted
- Qualified
- Converted
- Lost

### 📈 Dashboard

- Total Leads
- New Leads
- Contacted Leads
- Qualified Leads
- Converted Leads
- Lost Leads
- Lead analytics
- Data visualization

### 🔎 Search & Filtering

- Search by name
- Search by email
- Search by phone
- Search by company
- Search by service
- Filter by lead status
- Filter by follow-up date
- Pagination

### 🎨 UI/UX

- Modern dark interface
- Black and green theme
- Responsive layout
- Dashboard navigation
- Loading states
- Error handling
- Empty states
- Responsive lead table

---

## 📁 Project Structure

```text
Swan-Lead-Management-System/
│
├── Backend/
│   ├── models/
│   │   ├── Lead.js
│   │   └── User.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
├── README.md
└── package-lock.json
