🚀 FastHire — Job Portal Platform

A full-stack Job Portal Web Application that connects job seekers with employers through a modern, scalable, and role-based system.

Built with real-world hiring workflows, this project focuses on clean UI/UX, modular architecture, and dynamic data-driven dashboards.

🌐 Live Demo

I will add this give me some time.

📸 Screenshots
🏠 Homepage

🔐 Login / Register

💼 Job Listings

📄 Job Details

# 📊 Job Seeker Dashboard & Features

---

## 👤 Job Seeker Dashboard
- Profile completion tracking (dynamic %)
- Applications overview
- Skills & experience summary
- Resume status
- Real-time updates after profile changes

---

## 👤 Profile Page
- Basic Information (Name, Email, Phone, Location)
- Skills (tags-based UI)
- Work Experience section
- Education section
- Resume upload & replace
- Editable profile with live updates

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration & login
- JWT-based authentication *(backend integration in progress)*
- Role-based access:
  - 👤 Job Seeker
  - 🏢 Employer
- Protected routes

---

### 👤 Profile Management
- Job seeker profile:
  - Skills
  - Education
  - Work Experience
  - Bio/About
- Resume upload functionality
- Dynamic profile completion system
- Real-time dashboard updates

---

### 🔎 Job Search & Listings
- Browse all jobs
- Search by:
  - Keywords
  - Location
  - Category
- Clean and responsive job cards
- Human-readable timestamps *(e.g., "2 days ago")*

---

### 📄 Job Applications
- Apply for jobs
- Track application status:
  - Applied
  - Under Review
  - Accepted
- Job seeker application dashboard
- Employer-side application management UI

---

### 📊 Dashboards

#### 👤 Job Seeker Dashboard
- Profile completion tracking (dynamic %)
- Applications overview
- Skills & experience summary
- Resume status
- Smart UI with animations

#### 🏢 Employer Dashboard
- Job posting stats
- Applicant insights
- Hiring workflow overview

---

### 🎨 UI / UX
- Modern responsive design using Tailwind CSS
- Clean SaaS-style layout (not template-based)
- Micro-interactions:
  - Hover effects
  - Button animations
  - Progress animations
- Reusable component architecture
- Mobile-friendly design

---

## 🛠️ Tech Stack

### 🚀 Frontend
- React.js (Vite)
- React Router
- Tailwind CSS
- Context API
- Axios

### ⚙️ Backend
- Node.js
- Express.js
- MongoDB *(in progress / integrated)*
- Mongoose
- JWT Authentication

### 🧰 Tools
- Git & GitHub
- Postman
- VS Code

---

## 📁 Project Structure

### 📦 Frontend


frontend/
└── src/
├── api/
│ ├── authApi.js
│ ├── jobApi.js
│ ├── profileApi.js
│
├── components/
│ ├── common/
│ │ ├── Navbar.jsx
│ │ ├── Footer.jsx
│ │ ├── Loader.jsx
│ │
│ ├── dashboard/
│ │ ├── DashboardHeader.jsx
│ │ ├── StatsCard.jsx
│ │ ├── ProfileCompletionCard.jsx
│ │
│ ├── profile/
│ │ ├── ProfileForm.jsx
│ │ ├── SkillsSection.jsx
│ │ ├── ExperienceSection.jsx
│ │ ├── ResumeUpload.jsx
│ │
│ ├── jobs/
│ │ ├── JobCard.jsx
│ │ ├── JobList.jsx
│ │ ├── JobFilterBar.jsx
│
├── context/
│ ├── AuthContext.jsx
│ ├── ProfileContext.jsx
│
├── hooks/
│ ├── useAuth.js
│ ├── useProfile.js
│
├── pages/
│ ├── public/
│ │ ├── HomePage.jsx
│ │ ├── JobListPage.jsx
│ │ ├── JobDetailPage.jsx
│ │ ├── LoginPage.jsx
│ │ ├── RegisterPage.jsx
│ │
│ ├── jobseeker/
│ │ ├── Dashboard.jsx
│ │ ├── ProfilePage.jsx
│ │ ├── EditProfilePage.jsx
│
├── utils/
│ ├── calculateProfileCompletion.js
│ ├── formatDate.js
│
├── styles/
│ ├── globals.css
│
├── App.jsx
├── main.jsx


---

### 📦 Backend


backend/
└── src/
├── controllers/
│ ├── authController.js
│ ├── jobController.js
│ ├── profileController.js
│
├── models/
│ ├── User.js
│ ├── Job.js
│ ├── JobSeekerProfile.js
│
├── routes/
│ ├── authRoutes.js
│ ├── jobRoutes.js
│ ├── profileRoutes.js
│
├── middleware/
│ ├── authMiddleware.js
│
├── utils/
│ ├── calculateCompletion.js
│
├── config/
│ ├── db.js
│
└── server.js

---

🔥 Key Features Highlight
✅ Dynamic Profile Completion System
Calculates completion % based on real user data
Updates instantly on profile changes
Drives better user engagement
✅ Role-Based System
Separate flows for:
Job Seekers
Employers
Secure route protection
✅ Scalable Architecture
Modular folder structure
Reusable components
Clean separation of concerns

--- 

⚡ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/fasthire.git
cd fasthire
2️⃣ Setup Frontend
cd frontend
npm install
npm run dev
3️⃣ Setup Backend
cd backend
npm install
npm run server
4️⃣ Environment Variables

Create .env in backend:

PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
🚧 Future Improvements
🔔 Real-time notifications
💬 Chat between employer & candidate
🤖 AI-based job recommendations
📈 Advanced analytics dashboard

---
🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a PR.

---
📬 Contact
📧 Email: bhimansusekhar2004@gmail.com
💼 LinkedIn: www.linkedin.com/in/himansu-sekhar-behura-816133256
---
⭐ Acknowledgment

Inspired by real-world platforms like:

LinkedIn
Internshala
Indeed
---
📌 Final Note

This project demonstrates:

Full-stack development skills
UI/UX design thinking
Real-world application architecture


