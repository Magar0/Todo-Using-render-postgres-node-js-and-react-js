# Task Manager Application

![Task Manager Screenshot](https://github.com/user-attachments/assets/2a49bc50-3f6d-4c05-9ee8-a4945b836441)  
*A full-stack task management application with JWT authentication*

## 📋 <a name="table">Table of Contents</a>

1. 🟢 [Live](#live)
2. 🤖 [Project Overview](#overview)
3. 🔋 [Features](#features)
4. ⚙️ [Tech Stack](#tech-stack)
5. 🤸 [Quick Start](#quick-start)
6. 📡 [API Documentation](#api)
6. 🗃️ [Database Schema](#schema)

##  <a name="live"> 🟢Live Demo</a>
- Frontend: [Vercel App](https://todo-using-render-postgres-node-js-and-react-js.vercel.app/)
- Backend API: [Render Service](https://todo-using-render-postgres-node-js-and.onrender.com/)
- Yotube demo: https://youtu.be/nszUY-jpLHE
  
## 📌  <a name="overview"> Project Overview </a>
A secure **full-stack task management system** where users can:
- Register/login with JWT authentication  
- Create, organize, and track personal tasks  
- Manage tasks via an intuitive React interface  

**Key Highlights**:  
✔️ End-to-end TypeScript  
✔️ Protected routes with JWT  
✔️ Real-time task updates  
✔️ PostgreSQL with Drizzle ORM    

   
##  <a name="features">🔋Features </a>
- ✅ User registration and login with JWT
- 🔒 Secure password storage using bcrypt
- 📝 Create, read, update, and delete tasks
- 🗂️ Task organization with timestamps
- 🔄 Real-time updates
- 🚀 Protected routes for authenticated users

##  <a name="tech-stack">⚙️ Tech Stack </a>
**Frontend**  
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Backend**  
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-blue)

##  <a name="quick-start"> 🤸 Getting Started </a>

# 1. Clone and install dependencies
```bash
git clone https://github.com/Magar0/Todo-Using-render-postgres-node-js-and-react-js.git
cd ./Todo-Using-render-postgres-node-js-and-react-js

cd ./backend
npm install

cd ../frontend
npm install
```

**Configure backend environment**
```
cd backend
echo "DATABASE_URL=your_postgres_url" > .env
echo "JWT_SECRET=your_jwt_secret_here" >> .env
echo "PORT=4000" >> .env
```
**Note if you are using external render postgresql url , you might need to add "?ssl=true" eg:postgresql://user:password@localhost:5432/taskmanager?=ssl=true

**Configure Frontend environment**
```
cd client
echo "REACT_APP_SERVER_URL=your_server_url" > .env
```

**Database Setup**
```bash
npm run db:generate
npm run db:migrate
```

**Start development servers**
 Terminal 1 - Backend:
```
cd backend
npm run dev
```
 Terminal 2 - Frontend:
 ```
cd ../client
npm start
```

##   <a name="api">📡 API Documentation </a>

### Authentication
| Endpoint       | Method | Description           | Request Body                              |
|----------------|--------|-----------------------|-------------------------------------------|
| `/api/auth/signup` | POST   | Register new user     | `{ name, email, password }`               |
| `/api/auth/login`  | POST   | Login existing user   | `{ email, password }`                     |

### Tasks (Requires JWT)
| Endpoint            | Method | Description           | Request Body                              |
|---------------------|--------|-----------------------|-------------------------------------------|
| `/api/task`         | GET    | Get all user tasks    | -                                         |
| `/api/task`         | POST   | Create new task       | `{ title, description }`                  |
| `/api/task/:taskId` | PUT    | Update task           | `{ title, description, done }`            |
| `/api/task/:taskId` | DELETE | Delete task           | -                                         |

##   <a name="schema">  🗃️ Database Schema </a>
```typescript
// Users Table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Tasks Table
export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  done: boolean().default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});
```
