# FastHire 🚀

> A full-stack Job Portal Platform connecting job seekers with employers through a modern, scalable, role-based system — built with real-world hiring workflows and modular architecture.

🔗 **Live Demo:** [job-listing-portal-theta.vercel.app](https://job-listing-portal-theta.vercel.app/)

---

## 🧠 Project Idea

Traditional job portals are cluttered and lack proper UX. FastHire solves this with:

- Clean, modern UI
- Role-based dashboards
- Real-time profile & application tracking
- Smooth job discovery experience

---

## ✨ Core Features

### 🔐 Authentication & Authorization
- User Registration & Login
- JWT-based authentication
- Role-based access: **Job Seeker** & **Employer**
- Protected routes

### 👤 Profile Management
- Edit profile (Name, Email, Phone, Location)
- Skills with tag-based UI
- Work Experience & Education sections
- Resume upload & replace
- Dynamic profile completion tracking
- Real-time dashboard updates

### 🔎 Job Search & Listings
- Browse all jobs
- Search & filter by Keywords, Location, and Category
- Responsive job cards
- Human-readable timestamps (e.g., "2 days ago")

### 📄 Job Applications
- Apply for jobs
- Track application status: **Applied → Under Review → Accepted**
- Job seeker dashboard tracking
- Employer-side applicant management

### 📊 Dashboards

**Job Seeker Dashboard**
- Profile completion % tracking
- Applications overview
- Skills & resume summary
- Animated UI updates

**Employer Dashboard**
- Job posting statistics
- Applicant insights
- Hiring workflow overview

### 🎨 UI / UX
- Tailwind CSS modern design
- SaaS-style layout (not template-based)
- Micro-interactions: hover effects, button animations, progress animations
- Fully responsive design

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js (Vite), React Router, Tailwind CSS, Context API, Axios |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT |
| **Tools** | Git & GitHub, Postman, VS Code |

---

## 📂 Project Structure

```
fastHire/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── utils/
│       ├── styles/
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── config/
│   │   └── server.js
│   └── .env
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/fasthire.git
cd fasthire
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup
```bash
cd backend
npm install
npm run server
```

### 4. Environment Variables

> ⚠️ `.env` file is **NOT** included for security reasons.

Create `.env` inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 🚧 Future Enhancements

- [ ] 🔔 Real-time notifications
- [ ] 💬 Chat system (job seeker ↔ employer)
- [ ] 🤖 AI-based job recommendations
- [ ] 📈 Advanced analytics dashboard

---

## 🧠 Key Highlights

- ✅ Dynamic Profile Completion System
- 🔐 Role-Based Access Control
- 🛡️ Secure Authentication (JWT)
- 🧩 Modular Architecture
- ⚡ Real-time Dashboard Updates

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Submit a Pull Request

---

## 👨‍💻 Author

Developed by **Himansu Sekhar B.**

- 📧 Email: [bhimansusekhar2004@gmail.com](mailto:bhimansusekhar2004@gmail.com)
- 💼 LinkedIn: [himansu-sekhar-behura-816133256](https://www.linkedin.com/in/himansu-sekhar-behura-816133256)

---

## ⭐ Final Note

This is not just a basic CRUD project — it is a **real-world job portal system** designed with scalability, UI/UX and hiring workflows in mind.

> If you like this project, consider giving it a ⭐ on GitHub!
