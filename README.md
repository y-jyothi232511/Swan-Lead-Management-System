# Swan Lead Management System

A full-stack Lead Management System built for managing customer leads, tracking follow-ups, monitoring lead status, and viewing business analytics from a centralized dashboard.

## 🚀 Project Overview

The Swan Lead Management System is a web application designed for software and digital marketing companies to manage leads efficiently.

Users can securely log in, create and manage leads, search and filter records, track lead statuses, and monitor lead statistics through a dashboard.

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

## ✨ Features

### Authentication

- User registration
- User login
- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes

### Lead Management

- Create leads
- View leads
- Update leads
- Delete leads
- Track follow-up dates
- Add notes
- Track services interested in
- Track lead status
- Track created date

### Lead Statuses

- New
- Contacted
- Qualified
- Converted
- Lost

### Dashboard

- Total leads
- New leads
- Contacted leads
- Qualified leads
- Converted leads
- Lost leads
- Lead analytics and visualization

### Search & Filtering

- Search by name
- Search by email
- Search by phone
- Search by company
- Search by service
- Filter by status
- Filter by follow-up date
- Pagination

## 📁 Project Structure

```text
Swan-Lead-Management-System/
│
├── Backend/
│   ├── models/
│   │   ├── Lead.js
│   │   └── user.js
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
├── README.md
└── package-lock.json