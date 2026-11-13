# RND CADD - CAD / CAM / CAE / BIM Training Institute Platform & LMS

A modern, production-grade Next.js LMS and institutional web application for **RND CADD Training Institute**, Ameerpet, Hyderabad.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **MongoDB**, and **Cloudflare R2**.

---

## 🚀 Key Features

- **Public Institutional Portal**:
  - Interactive CAD/BIM course catalog (Civil, Mechanical, Electrical, Interior, PPM, Piping).
  - Curriculum explorer, fee calculators, inquiry forms, and campus location maps.

- **Student Learning Studio (`/portal/student`)**:
  - Full-screen interactive LMS player supporting **Google Drive streams**, YouTube embeds, and MP4 video playback.
  - Video and Lecture Notes mode switcher with embedded PDF viewer.
  - Progress tracker, syllabus checklist, and completed class marks.
  - Course handbook & e-book PDF reader.
  - Verified academic credentials and Autodesk/Dassault certification verification.
  - Core engineering job board & placement portal.

- **Administrative Management Dashboard (`/portal/admin`)**:
  - Student admission, access status (active / revoked), and fee installment management.
  - Multi-stream course and syllabus manager with live Google Drive video link synchronization.
  - Automated certificate generator & verification database.
  - Engineering job postings & applicant tracking system (ATS).
  - Support ticket resolution desk.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Native Node.js Driver)
- **Asset Storage**: [Cloudflare R2](https://developers.cloudflare.com/r2/) & Google Drive Embeds
- **Animations**: Framer Motion & GSAP
- **Email**: Nodemailer (SMTP notifications)

---

## 📦 Getting Started

### 1. Prerequisites
- **Node.js** v18.17 or higher
- **npm** or **yarn** or **pnpm**
- **MongoDB** instance (Local or MongoDB Atlas)

### 2. Installation
```bash
git clone https://github.com/YOUR_USERNAME/rnd-cadd.git
cd rnd-cadd
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
cp .env.example .env.local
```

### 4. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🚢 Deploying to GitHub & Vercel

### Step 1: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/rnd-cadd.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Select your imported GitHub repository `rnd-cadd`.
3. In **Environment Variables**, add the keys from your `.env.local` (especially `MONGODB_URI` pointing to MongoDB Atlas).
4. Click **Deploy**. Vercel will automatically build and publish your site with SSL.

---

## 📄 License
Private & Proprietary - RND CADD Training Institute, Ameerpet. All rights reserved.
