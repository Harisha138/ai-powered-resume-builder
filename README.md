
---

````markdown
# 🤖 AI Resume Builder

A powerful full-stack web application that helps job seekers create **ATS-optimized resumes** with **AI assistance** and **real-time scoring**.

![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-blue?style=for-the-badge&logo=openai)

---

## ✨ Features

### 🎯 ATS Optimization
- Real-time compatibility scoring
- Keyword suggestions
- Industry-specific advice
- Performance breakdowns

### 🤖 AI-Powered Content
- Summary generation
- Job description enhancement
- Skill suggestions
- Achievement optimization

### 📄 Resume Management
- Multiple templates
- Real-time preview
- PDF export
- Version control

### 🔐 Authentication & Security
- Google OAuth
- Email/password auth
- Session handling
- Rate limiting & Helmet

### 📊 Analytics Dashboard
- Resume performance insights
- Download tracking
- AI usage stats

---

## 🛠️ Tech Stack

### 🔷 Frontend
- **Next.js 14** with App Router
- **TypeScript**, **Tailwind CSS**
- **Radix UI**, **Lucide Icons**

### 🔶 Backend
- **Node.js**, **Express.js**
- **MongoDB** with **Mongoose**
- **Passport.js**, **JWT**, **Nodemailer**

### 🧠 AI & Utilities
- **OpenAI GPT-4**
- **PDFKit** for resume export
- **Helmet**, **Rate Limiter**, **bcryptjs**

---

## 🚀 Quick Start

### ✅ Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local)
- OpenAI API Key
- Google OAuth credentials

### 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ai-resume-builder.git
   cd ai-resume-builder
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env
   ```

4. **Update `.env`**

   ```env
   MONGODB_URI=your_mongo_uri
   SESSION_SECRET=your_session_secret
   OPENAI_API_KEY=your_openai_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CLIENT_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

5. **(Optional) Seed the database**

   ```bash
   npm run seed
   ```

6. **Run the app**

   ```bash
   npm run dev
   ```

7. **Open in browser**

   * Frontend: `http://localhost:3000`
   * Backend Health: `http://localhost:5000/api/health`

---

## 🔌 API Endpoints

### 🔐 Authentication

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/auth/google`
* `POST /api/auth/logout`
* `GET /api/auth/me`

### 📄 Resume

* `GET /api/resumes`
* `POST /api/resumes`
* `GET /api/resumes/:id`
* `PUT /api/resumes/:id`
* `DELETE /api/resumes/:id`
* `POST /api/resumes/:id/export`

### 🧠 AI Integration

* `POST /api/ai/generate-summary`
* `POST /api/ai/improve-description`
* `POST /api/ai/suggest-skills`
* `GET /api/ai/usage`

### 📊 ATS Scoring

* `POST /api/ats/analyze/:resumeId`

---

## 💡 Key Modules

### ✅ Real-time ATS Scoring

* Keyword relevance
* Formatting checks
* Section completeness
* Skill alignment

### 🧠 GPT-4 AI Content

* Job-based summaries
* Skill and achievement generation
* Role-focused language

### 🖨️ Professional PDF Export

* Clean ATS-friendly layout
* Multi-template support
* Optimized for recruiters & bots

---

## 🛡️ Security Measures

* bcrypt password hashing
* JWT/Session-based auth
* Input sanitization
* CORS & Helmet for secure headers
* Rate limiting on critical routes

---

## 📦 Deployment Guide

### 🧭 Frontend (Vercel)

```bash
npm run build
vercel --prod
```

### 🌐 Backend (Railway/Render/Heroku)

* Add `.env` values in hosting platform settings
* Deploy with Git or CLI

### 🗄️ Database (MongoDB Atlas)

* Create cluster
* Allow IP access
* Copy URI into `.env`

---

## 📊 Performance Highlights

* ⚡ Page Load Time: < 2s
* 🧠 ATS Match Score: 90%+
* 🪄 Lighthouse Performance: 95+
* 🧾 PDF Export: < 1s avg

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch:

   ```bash
   git checkout -b feature/my-feature
   ```
3. Commit your changes:

   ```bash
   git commit -m "Add feature"
   ```
4. Push to GitHub:

   ```bash
   git push origin feature/my-feature
   ```
5. Submit a Pull Request 🚀

---

## 📂 Example `.env` File

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# MongoDB
MONGODB_URI=your-mongodb-uri

# Authentication
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Public Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000

# Email (Optional)
FROM_EMAIL=noreply@example.com
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password

# File Uploads
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 📸 Screenshots

<img src="./Screenshot (134).png" width="100%">
<img src="./Screenshot (132).png" width="100%">
<img src="./Screenshot 2025-06-16 100711.png" width="100%">
<img src="./Screenshot (131).png" width="100%">
<img src="./Screenshot (129).png" width="100%">
<img src="./Screenshot (128).png" width="100%">
<img src="./Screenshot (133).png" width="100%">
<img src="./Screenshot (137).png" width="100%">
<img src="./Screenshot (136).png" width="100%">
```

---

