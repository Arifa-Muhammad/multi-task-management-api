# MyBuilds — Secure Multi-User Task Management API

A secure and production-minded RESTful Task Management API built with **Node.js, Express.js, MongoDB, and JWT authentication**.

MyBuilds allows users to securely manage their personal tasks with authentication, task ownership, search and filtering, pagination, task statistics, soft deletion, activity tracking, and profile avatar management.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User registration and login
* Password hashing with bcrypt
* JWT-based authentication
* Access token + refresh token system
* Refresh token stored in database
* HTTP-only authentication cookies
* Logout functionality
* Protected routes
* User ownership validation
* Change password
* Profile management

### 📋 Task Management

* Create tasks
* Get all personal tasks
* Get a single task
* Update tasks
* Soft delete tasks
* Restore deleted tasks
* Task ownership protection
* Task status:

  * `pending`
  * `completed`
* Task priority:

  * `low`
  * `medium`
  * `high`
* Due dates

### 🔎 Search & Filtering

* Search tasks by title
* Filter by status
* Filter by priority
* Pagination
* Newest/oldest sorting
* Pagination metadata

### 📊 Task Statistics

Provides:

* Total tasks
* Completed tasks
* Pending tasks
* High-priority tasks
* Completion percentage

### 📝 Activity Tracking

Tracks important task actions:

* Created
* Updated
* Completed
* Deleted
* Restored

Users can retrieve their recent activity history.

### 🖼️ Avatar Management

* Upload profile avatar
* JPG, PNG and WEBP support
* Maximum file size: 2 MB
* Local temporary upload using Multer
* Cloudinary image storage
* Old avatar deletion from Cloudinary
* Temporary local file cleanup

### 🛡️ Security

* JWT authentication
* Password hashing with bcrypt
* Protected routes
* CORS configuration
* Helmet security headers
* Request validation with express-validator
* Authentication rate limiting
* HTTP-only cookies
* User ownership checks
* Centralized error handling
* File type validation
* File size limits

### ⚡ Performance

* MongoDB indexes for frequently queried fields
* Pagination for task search
* Efficient user-specific task queries
* Soft-delete filtering

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication & Security

* JSON Web Tokens (JWT)
* bcrypt
* Helmet
* CORS
* express-rate-limit
* express-validator
* cookie-parser

### File Upload & Storage

* Multer
* Cloudinary

### Development

* Nodemon
* Prettier
* Postman

---

## 📁 Project Structure

```text
MyBuilds/
│
├── public/
│   └── temp/
│       └── .gitkeep
│
├── src/
│   ├── controllers/
│   │
│   ├── db/
│   │   └── dbConnection.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── multer.middleware.js
│   │   └── rateLimit.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── task.model.js
│   │   └── activity.model.js
│   │
│   ├── routes/
│   │   ├── user.routes.js
│   │   └── task.routes.js
│   │
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── cloudinary.js
│   │
│   ├── app.js
│   ├── constants.js
│   └── index.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
```

### 2. Move into the project directory

```bash
cd MyBuilds
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create environment variables

Create a `.env` file in the project root.

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string
DB_NAME=taskManagement

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

CORS_ORIGIN=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> Never commit your `.env` file or expose your secrets publicly.

### 5. Start development server

```bash
npm run dev
```

The API will run on:

```text
http://localhost:8000
```

---

# 🔗 API Endpoints

Base URL:

```text
http://localhost:8000/api/v1
```

---

## 🔐 Authentication

| Method | Endpoint                | Description              | Auth |
| ------ | ----------------------- | ------------------------ | ---- |
| POST   | `/auth/register`        | Register a new user      | No   |
| POST   | `/auth/login`           | Login user               | No   |
| POST   | `/auth/logout`          | Logout user              | Yes  |
| GET    | `/auth/get-profile`     | Get current user profile | Yes  |
| PUT    | `/auth/profile`         | Update profile           | Yes  |
| PUT    | `/auth/change-password` | Change password          | Yes  |
| POST   | `/auth/refresh-token`   | Refresh access token     | No*  |
| PATCH  | `/auth/update-avatar`   | Update profile avatar    | Yes  |

* Requires a valid refresh token.

---

## 📋 Task Management

| Method    | Endpoint                     | Description           | Auth |
| --------- | ---------------------------- | --------------------- | ---- |
| POST      | `/task/create-task`          | Create a task         | Yes  |
| GET       | `/task/get-tasks`            | Get user's tasks      | Yes  |
| GET       | `/task/get-task/:taskId`     | Get one task          | Yes  |
| PUT/PATCH | `/task/update-task/:taskId`  | Update a task         | Yes  |
| GET       | `/task/search`               | Search/filter tasks   | Yes  |
| GET       | `/task/stats`                | Get task statistics   | Yes  |
| PATCH     | `/task/delete-task/:taskId`  | Soft delete a task    | Yes  |
| PATCH     | `/task/restore-task/:taskId` | Restore deleted task  | Yes  |
| GET       | `/task/activity`             | Get recent activities | Yes  |

---

# 🔎 Search API

The search endpoint supports title search, filtering, pagination, and sorting.

### Example

```text
GET /api/v1/task/search?title=project
```

### Status filter

```text
GET /api/v1/task/search?status=completed
```

### Priority filter

```text
GET /api/v1/task/search?priority=high
```

### Pagination

```text
GET /api/v1/task/search?page=1&limit=10
```

### Sorting

```text
GET /api/v1/task/search?sort=newest
```

Available sorting values:

```text
newest
oldest
```

Filters can also be combined:

```text
GET /api/v1/task/search?title=project&status=pending&priority=high&page=1&limit=10&sort=newest
```

---

# 📊 Task Statistics

```text
GET /api/v1/task/stats
```

Example response data:

```json
{
  "totalTask": 10,
  "completedTask": 6,
  "pendingTask": 4,
  "priorityTask": 3,
  "completionPercentage": 60
}
```

---

# 📝 Activity Log

```text
GET /api/v1/task/activity
```

The API records actions such as:

```text
created
updated
completed
deleted
restored
```

---

# 🔒 Authentication Flow

MyBuilds uses an access-token and refresh-token architecture.

```text
User Login
    ↓
Credentials Verified
    ↓
Access Token + Refresh Token Generated
    ↓
Refresh Token Stored in Database
    ↓
Tokens Sent Using HTTP-only Cookies
    ↓
Protected Request
    ↓
JWT Middleware
    ↓
User Verified
    ↓
Controller
```

If the access token expires, the refresh-token endpoint can be used to generate a new access token.

---

# 👤 Task Ownership

Every task belongs to the user who created it.

```text
User
  │
  └── Tasks
       ├── Task 1
       ├── Task 2
       └── Task 3
```

Protected task queries verify both:

```text
owner
+
task ID
```

Therefore, a user cannot access or modify another user's tasks.

---

# 🗑️ Soft Delete

Tasks are not immediately removed from the database.

Instead:

```text
isDeleted: false
        ↓
Delete Task
        ↓
isDeleted: true
```

Deleted tasks can later be restored:

```text
isDeleted: true
        ↓
Restore Task
        ↓
isDeleted: false
```

This preserves the task record while keeping it hidden from normal task queries.

---

# 🧪 Testing

The API can be tested using **Postman**.

Recommended testing flow:

```text
1. Register
2. Login
3. Create Task
4. Get Tasks
5. Get Task By ID
6. Update Task
7. Search / Filter
8. Check Statistics
9. Complete Task
10. Check Activity
11. Soft Delete
12. Restore
13. Update Profile
14. Upload Avatar
15. Logout
16. Refresh Access Token
```

Security/edge cases:

```text
✓ Missing token
✓ Invalid token
✓ Expired token
✓ Invalid refresh token
✓ Unauthorized task access
✓ Invalid file type
✓ File larger than 2 MB
✓ Invalid request data
✓ Rate-limited authentication requests
```

---

# 🌱 Future Improvements

Possible future improvements include:

* Email verification
* Forgot/reset password
* Advanced task analytics
* Task reminders
* Due-date notifications
* Role-based authorization
* Automated testing
* API documentation with Swagger/OpenAPI
* Docker support
* Production deployment
* CI/CD pipeline

---

# 🎯 Project Goals

This project was built to practice and demonstrate real-world backend concepts including:

* REST API architecture
* Authentication and authorization
* JWT access/refresh token systems
* Password security
* MongoDB data modeling
* Mongoose relationships
* Input validation
* Error handling
* File uploads
* Cloud storage
* Search and pagination
* Database indexing
* Activity logging
* API security
* Production-oriented backend structure

---

## 👩‍💻 Author

**Arifa Muhammad**

Computer Science Student | Full-Stack Web Development

---

## 📄 License

This project is created for learning, portfolio, and educational purposes.
