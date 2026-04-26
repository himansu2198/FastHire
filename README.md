🚀 FastHire — Job Portal Platform

A Full-stack Job Portal Web Application that connects job seekers with employers through a modern, scalable, and role-based system.

Built with real-world hiring workflows, this project focuses on clean UI/UX, modular architecture, and dynamic data-driven dashboards.
---
🌐 Live Demo
https://job-listing-portal-theta.vercel.app/


📸 Screenshots
🏠 Homepage
<img width="1889" height="920" alt="image" src="https://github.com/user-attachments/assets/5722d74b-929f-436f-bf23-09d21f872552" />
<img width="1881" height="920" alt="image" src="https://github.com/user-attachments/assets/c9219fc7-a60f-4dd5-81d2-54f384dc6684" />
<img width="1870" height="732" alt="image" src="https://github.com/user-attachments/assets/aacfbe13-c0be-4afe-b630-6935a24453e1" />
---


🔐 Login / Register
<img width="1884" height="910" alt="image" src="https://github.com/user-attachments/assets/190e02ea-6a9c-4012-9b01-9eacb820f426" />
<img width="1888" height="901" alt="image" src="https://github.com/user-attachments/assets/6f262558-ada4-49f6-91c8-6bbeb8c07728" />
---


💼 Job Listings
<img width="1882" height="857" alt="image" src="https://github.com/user-attachments/assets/5215c0da-1b6d-46e4-a0b1-ff3564dd78d2" />
<img width="1883" height="892" alt="image" src="https://github.com/user-attachments/assets/ec502892-35c2-436c-844b-9d3febdd3863" />
---
📄 Job Details
<img width="1592" height="858" alt="image" src="https://github.com/user-attachments/assets/0023ea24-98c7-4e37-bdc3-eb29ce9cc628" />
---
# 📊 Job Seeker Dashboard & Features
<img width="1872" height="844" alt="image" src="https://github.com/user-attachments/assets/44f25cbe-0a33-4bf9-b5e0-3b16799cafc7" />
<img width="1412" height="770" alt="image" src="https://github.com/user-attachments/assets/aad4cadc-ed44-4814-bd18-1fd1af3b355d" />



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

📁 Project Structure
fastHire/
│
├── frontend/                      # React Frontend
│   ├── public/
│   │
│   └── src/
│       ├── api/
│       │   ├── authApi.js
│       │   ├── jobApi.js
│       │   └── profileApi.js
│       │
│       ├── components/
│       │   ├── common/
│       │   │   ├── Navbar.jsx
│       │   │   ├── Footer.jsx
│       │   │   └── Loader.jsx
│       │   │
│       │   ├── dashboard/
│       │   │   ├── DashboardHeader.jsx
│       │   │   ├── StatsCard.jsx
│       │   │   └── ProfileCompletionCard.jsx
│       │   │
│       │   ├── profile/
│       │   │   ├── ProfileForm.jsx
│       │   │   ├── SkillsSection.jsx
│       │   │   ├── ExperienceSection.jsx
│       │   │   └── ResumeUpload.jsx
│       │   │
│       │   └── jobs/
│       │       ├── JobCard.jsx
│       │       ├── JobList.jsx
│       │       └── JobFilterBar.jsx
│       │
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── ProfileContext.jsx
│       │
│       ├── hooks/
│       │   ├── useAuth.js
│       │   └── useProfile.js
│       │
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── Dashboard.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── EditProfilePage.jsx
│       │   ├── JobListPage.jsx
│       │   ├── JobDetailPage.jsx
│       │   └── MyApplications.jsx
│       │
│       ├── utils/
│       │   ├── calculateProfileCompletion.js
│       │   └── formatDate.js
│       │
│       ├── styles/
│       │   └── globals.css
│       │
│       ├── App.jsx
│       └── main.jsx
│
├── backend/                       # Node.js Backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── jobController.js
│   │   │   └── profileController.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Job.js
│   │   │   └── JobSeekerProfile.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── jobRoutes.js
│   │   │   └── profileRoutes.js
│   │   │
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── utils/
│   │   │   └── calculateCompletion.js
│   │   │
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   └── server.js
│   │
│   └── .env
│
├── .gitignore
├── README.md

---

🔥 Key Features Highlight
✅ Dynamic Profile Completion System
Calculates completion percentage based on real user data and updates instantly.
🔐 Role-Based System
Separate flows for:
Job Seekers
Employers
🛡️ Secure Route Protection
Authentication-based protected routes using JWT.
🧩 Scalable Architecture
Modular folder structure with reusable components.
⚡ Real-time UI Updates
Dashboard reflects profile changes instantly.
⚡ Installation & Setup
1️⃣ Clone the Repository
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
🔐 Environment Variables

Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
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


