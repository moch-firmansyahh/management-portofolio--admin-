# 🚀 I-BOARD — Personal Portfolio Admin Dashboard

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Express.js](https://img.shields.io/badge/Express.js-4.19-000000?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)

**A modern, full-stack administrative dashboard to manage portfolio content, sync GitHub repositories & skills, monitor contribution metrics, and upload assets in real time.**

[Feature Highlights](#-key-features) • [Tech Stack](#%EF%B8%8F-tech-stack) • [Getting Started](#-getting-started) • [API Documentation](#-api-endpoints) • [Project Structure](#-project-structure)

</div>

---

## 📖 Overview

**I-BOARD** is an analytical and administrative dashboard designed for developer portfolios. Built with Next.js 16 (App Router), React 19, TypeScript, Firebase Firestore, and an Express.js backend for file uploads, it offers a seamless interface to manage technical skills, showcase projects, and automatically integrate public GitHub repositories and activity calendars.

---

## ⚡ Key Features

- **🔐 Passcode Authentication**: Secure login gate protecting the administrative panel.
- **📊 Interactive Analytics Dashboard**: Real-time metrics overview including total projects, skills registered, public GitHub repositories, and follower counts.
- **📅 GitHub Contribution Calendar**: Integrated visual contribution graph powered by `react-github-calendar`.
- **🔄 GitHub Automatic Sync**:
  - **Projects Sync**: One-click import of public GitHub repositories into Firebase Firestore with OpenGraph thumbnail previews.
  - **Skills Sync**: Automatic analysis of programming languages used across public repositories, auto-populating skill entries.
- **🛠️ Full CRUD Operations**:
  - **Skills Management**: Add, edit, or delete skills with percentage mastery levels (0–100%) and automatic acronym logo generation.
  - **Projects Management**: Add, edit, or delete showcase projects with custom description, demo URLs, and image uploads.
- **🔍 Real-Time Search & Keyboard Shortcut (`Ctrl+K` / `⌘K`)**:
  - Instant live filtering across skills, project titles, descriptions, and links.
  - Keyboard shortcut `Ctrl + K` (or `Cmd + K`) to immediately focus the search bar.
- **🔔 Activity Notifications Popover**: Live tracking of recent actions, sync results, and system state updates.
- **🖼️ Express File Upload API**: Dedicated Express backend server using `Multer` with MIME type validation, file size limits (5 MB max), filename sanitization, and CORS handling.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [TailwindCSS 3.4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database Client**: [Firebase Firestore SDK v12](https://firebase.google.com/)
- **Git Calendar**: [react-github-calendar](https://www.npmjs.com/package/react-github-calendar)

### Backend API
- **Runtime**: [Node.js](https://nodejs.org/) with [Express.js 4](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (`ts-node-dev`)
- **File Upload Handler**: [Multer](https://github.com/expressjs/multer)
- **Middleware**: `cors`, `dotenv`

---

## 📁 Project Structure

```text
portofolio-admin/
├── backend/                  # Express.js REST API Server
│   ├── src/
│   │   └── server.ts         # Express server & Multer upload handling
│   ├── uploads/              # Stored uploaded project images
│   ├── package.json
│   └── tsconfig.json
├── frontend/                 # Next.js Frontend Web Application
│   ├── public/               # Static assets & fallback images
│   │   └── assets/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css   # Global TailwindCSS & custom styles
│   │   │   ├── layout.tsx    # Root layout configuration
│   │   │   └── page.tsx      # Main Admin Dashboard page
│   │   ├── components/       # Modular UI Components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── DashboardTab.tsx
│   │   │   ├── SkillsTab.tsx
│   │   │   ├── ProjectsTab.tsx
│   │   │   ├── SkillModal.tsx
│   │   │   ├── ProjectModal.tsx
│   │   │   ├── ConfirmModal.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── Toast.tsx
│   │   └── lib/
│   │       └── firebase.ts   # Firebase app & Firestore initialization
│   ├── .env.local            # Frontend environment variables
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have installed:
- **Node.js**: `v18.x` or `v20.x`
- **npm**: `v9.x` or `v10.x`

---

### 1. Clone the Repository
```bash
git clone https://github.com/moch-firmansyahh/management-portofolio--admin-.git
cd management-portofolio--admin-
```

---

### 2. Backend Setup (`/backend`)
Open a terminal in the `backend` directory:
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory (optional):
```env
PORT=3002
BASE_URL=http://localhost:3002
```

Start the Express development server:
```bash
npm run dev
```
> Server runs on `http://localhost:3002`

---

### 3. Frontend Setup (`/frontend`)
Open another terminal in the `frontend` directory:
```bash
cd frontend
npm install
```

Ensure `.env.local` contains your Firebase and Backend API configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

NEXT_PUBLIC_BACKEND_URL=http://localhost:3002
```

Start the Next.js development server:
```bash
npm run dev
```
> App runs on `http://localhost:3000`

---

## 📡 API Endpoints (Backend Server)

| Method | Endpoint | Description | Request Body / Form |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | API status message | None |
| `GET` | `/api/health` | Health check endpoint | None |
| `POST` | `/api/upload` | Upload single project image | Multipart form (`file`: Image file max 5MB) |
| `GET` | `/uploads/:filename` | Serve static uploaded image file | None |

---

## 🔐 Credentials & Default Access

- **Admin Password**: `admin123` *(Configurable in `frontend/src/app/page.tsx`)*

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/moch-firmansyahh">Moch Firmansyah</a></sub>
</div>
