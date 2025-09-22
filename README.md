# Bug Tracker (MongoDB + Express + React)

A simple bug-tracking system built with **MongoDB**, **Express**, and **React**.  
It allows users (reporters) to register, log in, and submit bugs.  
An **admin** can view all bugs and update statuses.

---

## Features

- Register/Login with JWT authentication
- Role-based access: `reporter` vs `admin`
- Report new bugs with title, description, and severity
- Dashboard with filters (status, severity) and search
- Update bug status (Open → In Progress → Closed)
- Admin sees all bugs, reporters see their own only

---

## Setup Instructions

### 1. Clone repo

```bash
git clone https://github.com/your-username/bug-tracker.git
cd bug-tracker
```

### 2. Backend setup

cd backend
npm install

**Create `.env` inside `backend:`**

```
PORT=5000
MONGO_URI=your_mongo_uri_here
JWT_SECRET=your_secret_here
ADMIN_EMAIL=admin@example.com
ADMIN_PASS=admin123
```

**Start backend:**

```
npm run dev
```

**Seed admin user (run once):**

```
node seedAdmin.js
```

### 3. Frontend setup

```
cd ../frontend
npm install
```

**Create `.env` inside `frontend`:**

```
VITE_API_URL=http://localhost:5000/api
```

**Start frontend:**

```
npm run dev
```

Visit: http://localhost:5173

### Database Schema Diagram

```
erDiagram
    USER {
        string _id PK
        string name
        string email
        string password (hashed)
        string role  // reporter | admin
        date createdAt
        date updatedAt
    }

    BUG {
        string _id PK
        string title
        string description
        string severity  // Low | Medium | High
        string status    // Open | In Progress | Closed
        string reporter FK
        date createdAt
        date updatedAt
    }

    USER ||--o{ BUG : "reports"
```

### Deployment

Frontend: https://bug-reporting-tracking.vercel.app/
