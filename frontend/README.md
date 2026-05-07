# Frontend - Student Management System

This is the frontend of the Student Management System, built with **React**, **Vite**, and **Ant Design**.

## 🚀 Getting Started

To get the frontend up and running locally, follow these steps:

### 1. Prerequisites
- **Node.js**: v20 or later (LTS recommended)
- **npm** or **yarn**

### 2. Installation
Navigate to the frontend directory and install the required dependencies:
```bash
cd frontend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root of the frontend folder (you can copy from `.env.example`):
```bash
cp .env.example .env
```
Ensure the `VITE_API_URL` points to your backend server (e.g., `http://localhost:8000`).

### 4. Development Server
Start the development server with hot-reload:
```bash
npm run dev
```
Once started, the application will be available at: [http://localhost:5173](http://localhost:5173)

### 5. Production Build
To build the project for production, run:
```bash
npm run build
```
The optimized files will be generated in the `dist/` directory.

---

## 🐳 Running with Docker (Recommended)
If you prefer using Docker, you can start the entire stack (Frontend, Backend, DB) from the project root:
```bash
docker-compose up --build
```
