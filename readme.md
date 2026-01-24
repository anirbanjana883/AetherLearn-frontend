# 🎓 AetherLearn – Scalable E-Learning & Gamified Education Platform (Frontend)

**AetherLearn** is a high-performance, production-grade **frontend** for a modern **Learning Management System (LMS)**.  
Built for **ultimate speed and interactivity**, it leverages **React 19**, **Vite 7**, and **Tailwind CSS v4** to deliver a seamless, gamified learning experience for both **students** and **educators**.

This frontend emphasizes:

- **Gamified Progression** – Dynamic charts, streak tracking, and achievement unlocks
- **Complex Dashboard UI** – Role-specific layouts for Students and Educators
- **Optimized Video Delivery** – Custom video player for high-retention learning
- **AI-Powered Learning Assistance** – Smart search and AI helpers powered by Gemini

---

## 🛠️ Tech Stack & Dependencies

### Core
- React **19**
- Vite **7**

### State Management
- Redux Toolkit **v2**

### Routing
- React Router **v7**

### Styling & Animation
- Tailwind CSS **v4**
- Tailwind CSS Animated

### Data Visualization & Gamification
- Recharts
- React Calendar Heatmap
- React Tooltip

### Auth & Backend Integration
- Firebase **v12**
- Axios

### UI Components
- React Icons
- React Spinners
- React Toastify

---

## 🚀 Key Features

---

### 🎮 Gamified Learning Environment

- **Streak Tracker**
  - GitHub-style daily activity heatmap using `react-calendar-heatmap`
- **Analytics & Progression**
  - Visual course completion and score tracking using Recharts
- **Achievements UI**
  - Animated badge unlocks for milestones  
  - Implemented via `AchievementsPanel.jsx`

---

### 📚 Immersive Course Delivery

- **Custom Video Interface**
  - Ergonomic, distraction-free learning experience
  - Powered by `ModernVideoPlayer.jsx`
- **Structured Roadmap**
  - Clear module and lecture navigation for enrolled courses
- **Dynamic Content Loading**
  - Infinite scrolling and paginated course discovery

---

### 👨‍🏫 Dedicated Educator Dashboard

- Secure instructor portal
- Course revenue and student engagement analytics (`StatsBar`)
- Intuitive course creation flows:
  - `CreateCourses.jsx`
  - `CreateLecture.jsx`
- Form-heavy interfaces for managing and updating modules

---

### 🤖 AI Search & Discovery

- **Gemini AI Integration**
  - Context-aware course search via `SearchWithAi.jsx`
- Intelligent recommendations based on user prompts and learning intent

---

### 💳 Payments & Security

- Secure Razorpay frontend integration for instant course enrollment
- Google OAuth and Email/Password authentication via Firebase
- Redux-managed auth state
- Protected route guards for:
  - Public users
  - Students
  - Educators

---

## 🏗️ High-Level Architecture
```
User Interface (React 19 + Vite 7)
│
├── Routing Layer (React Router v7)
│ ├── Public Routes (Login, Signup, Home, All Courses)
│ ├── Student Routes (My Courses, View Lecture, AI Search)
│ └── Educator Routes (Dashboard, Create Course, Analytics)
│
├── State Management (Redux Toolkit)
│ ├── userSlice (Auth, RBAC, Profile)
│ ├── courseSlice (Search, Filter, Pagination)
│ ├── lectureSlice (Current Video, Progress Tracking)
│ └── reviewSlice (Course Ratings)
│
├── Component Layer
│ ├── Data Visuals (Recharts, Heatmap)
│ ├── Interactive Modals & Toastify
│ └── Layouts (Navbar, Footer, StatsBar)
│
└── Data Layer
├── Axios Interceptors (JWT passing)
└── Backend API Gateway & Razorpay


```

## 🗂️ Project Structure
```
AetherLearn-frontend/
├── public/ # Static assets (logo.png)
├── src/
│ ├── assets/ # Images, icons, audio (start.mp3)
│ ├── component/ # Reusable UI components
│ │ ├── AchievementsPanel.jsx # Gamification UI
│ │ ├── CourseProgressChart.jsx # Recharts charts
│ │ ├── ModernVideoPlayer.jsx # Custom lecture player
│ │ ├── StudentHeatmap.jsx # Streak tracker
│ │ └── ...
│ ├── customHooks/ # Shared hooks (getCurrentUser, getAllReviews)
│ ├── pages/ # Route-level pages
│ │ ├── Educator/ # Instructor-specific pages
│ │ └── Student/Public # Learner & public views
│ ├── redux/ # Redux store & slices
│ ├── utils/ # Firebase config, constants
│ ├── App.jsx # Main router
│ └── main.jsx # React DOM root
├── eslint.config.js # ESLint 9 configuration
├── package.json
└── vite.config.js # Tailwind v4 & Vite config
```

## 🔗 Core Routes (High-Level)

---

### 🌐 Public & Auth

| Route | Component | Description |
|------|----------|-------------|
| `/` | Home.jsx | Landing page |
| `/login` | Login.jsx | User login |
| `/signup` | SignUp.jsx | User registration |
| `/all-courses` | AllCourses.jsx | Course catalog |

---

### 🎓 Student (Protected)

| Route | Component | Description |
|------|----------|-------------|
| `/student/dashboard` | StudentDashboard.jsx | Heatmap, stats, activity |
| `/student/my-courses` | MyEnrolledCourse.jsx | Purchased courses |
| `/view-course/:id` | ViewCourse.jsx | Course outline |
| `/view-lecture/:courseId/:lectureId` | ViewLecture.jsx | Video player |
| `/search-with-ai` | SearchWithAi.jsx | Gemini-powered search |

---

### 👨‍🏫 Educator (Protected)

| Route | Component | Description |
|------|----------|-------------|
| `/educator/dashboard` | Dashboard.jsx | Analytics & revenue |
| `/educator/courses` | Courses.jsx | Managed courses |
| `/educator/create-course` | CreateCourses.jsx | Course builder |

---

## ⚙️ Setup Instructions (Local)

### 1️⃣ Prerequisites
- Node.js ≥ 18
- npm or yarn

---

### 2️⃣ Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1

# Firebase (Google OAuth)
VITE_FIREBASE_APIKEY=your_firebase_api_key

# Payments
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

**3️⃣ Install Dependencies**
```
npm install
```
**4️⃣ Run Development Server**
```
npm run dev
```
**5️⃣ Build for Production**
```
npm run build
```

**📈 Scalability & Performance Talking Points**

- Vite 7 + React 19

- Sub-second HMR

- Aggressively optimized build output

- Tailwind CSS v4

- Faster JIT engine

- No external PostCSS configuration required

- Redux Slice Architecture

- Clean separation of complex state:

- Course caching

- Video progression

- API polling

- Optimized Rendering

- Memoized charts (Recharts)

- Optimized heatmaps to prevent unnecessary re-renders

# 🧠 What This Frontend Demonstrates
- ✅ Complex gamification UI (Heatmaps, Progress Charts, Badges)
- ✅ Advanced data visualization with React-friendly libraries
- ✅ Distinct user experiences (Student vs Educator flows)
- ✅ Secure payment integration (Razorpay)
- ✅ Modern AI-powered search and discovery

