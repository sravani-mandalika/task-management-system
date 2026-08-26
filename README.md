# Task Management System

A full-stack MERN application for managing projects and tasks — create projects, assign tasks to team members, track progress, and view project stats from a live dashboard.

## Project Overview

This app lets a team:
- Create and manage projects with members
- Create, assign, and track tasks within those projects
- Filter and search tasks by status, priority, or keyword
- View real-time stats on a dashboard (total projects, active projects, tasks by status/priority)

Built as a 2-day MERN stack assignment focused on REST API design, MongoDB data modeling, React integration, validation, and error handling.

## Tech Stack

- **React** (Vite) — frontend
- **React Router** — client-side routing
- **Axios** — API requests
- **Node.js** + **Express** — backend REST API
- **MongoDB** + **Mongoose** — database and schema modeling
- **express-validator** — request validation
- **Git / GitHub** — version control

## Installation

Clone the repo, then install dependencies for both the server and client:

```bash
git clone https://github.com/sravani-mandalika/task-management-system.git
cd task-management-system

cd server
npm install

cd ../client
npm install
```

## Environment Variables

Create a `.env` file inside `server/` with the following:

- `MONGO_URI` — your MongoDB Atlas (or local) connection string
- `PORT` — the port the backend server runs on (defaults to 5000)

**Never commit your actual `.env` file** — it's already excluded via `.gitignore`.

## Running the Application

You need two terminals running at the same time:

**Backend:**
```bash
cd server
npm run dev
```
Runs on `http://localhost:5000`

**Frontend:**
```bash
cd client
npm run dev
```
Runs on `http://localhost:5173` (or the port Vite prints)

Open the frontend URL in your browser once both are running.

## API Documentation

Base URL: `http://localhost:5000/api`

All responses follow this shape:
```json
{ "success": true, "data": ... }
```
or on error:
```json
{ "success": false, "message": "..." }
```

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | List all users |
| GET | `/users/:id` | Get a single user |
| POST | `/users` | Create a user |

### Projects
| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects` | List all projects |
| GET | `/projects/:id` | Get a single project |
| POST | `/projects` | Create a project |
| PUT | `/projects/:id` | Update a project (also used to add/remove members) |
| DELETE | `/projects/:id` | Delete a project |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | List tasks — supports `?status=`, `?priority=`, `?project=`, `?assignedTo=`, `?search=`, `?page=`, `?limit=` |
| GET | `/tasks/:id` | Get a single task |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

**Example — filter tasks:**

GET /api/tasks?status=IN_PROGRESS&priority=HIGH&page=1&limit=10

## Screenshots

![Dashboard](screenshots/dashboard (2).png)
![Projects](screenshots/projects.png)
![Project Details](screenshots/project-details.png)
![Tasks](screenshots/tasks.png)
