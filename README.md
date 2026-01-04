
# Advanced School Management System (ASMS)

**Enterprise-Grade Educational Management Platform**

![Status](https://img.shields.io/badge/Status-Development-orange?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)

## 📌 Overview

The **Advanced School Management System (ASMS)** is a comprehensive, scalable, and modern platform designed to digitize and automate academic, administrative, financial, and operational workflows for educational institutions. 

Built with **Next.js 16** and **Shadcn UI**, ASMS offers a premium, glassmorphism-inspired interface that ensures a world-class user experience across all roles. From secure result processing to wallet-based fee payments, ASMS integrates complex school operations into a single, intuitive dashboard.

---

## 🚀 Tech Stack

### Frontend & UI
- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, CSS Modules
- **Component Library:** Shadcn UI (Radix UI)
- **Icons:** Lucide React
- **Design System:** Glassmorphism, Premium Gradients, Micro-animations

### Backend & Database
- **Runtime:** Node.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** NextAuth.js (v5 Beta) / JWT
- **Caching:** Redis (future integration)

### DevOps & Tools
- **Package Manager:** npm / bun
- **Validation:** Zod
- **Forms:** React Hook Form
- **Linting:** ESLint

---

## ✨ Key Features by Role

### 👨‍🏫 Teacher Portal
- **Academic Management:** Create/Edit Assignments, Tests, and Exams.
- **Results Engine:** Input scores, auto-calculate grades, and generate report sheets.
- **Classroom Tools:** Mark attendance, log behavioral remarks, and view student profiles.
- **Scheduling:** Interactive daily schedule and lesson plan tracking.

### 👨‍🎓 Student Portal
- **Performance Tracking:** View academic summary, CGPA, and term results.
- **Assessment Hub:** Take online exams (token-based), submit assignments, and view graded work.
- **Digital Toolkit:** Access weekly timetable, subject resources, and group chats.

### 👨‍👩‍👧 Parent Portal
- **Ward Overview:** Monitor multiple children’s academic progress from a single dashboard.
- **Financial Wallet:** Fund wallet, pay school fees securely, and view transaction history.
- **Instant Updates:** Receive real-time notifications for attendance, results, and fees.

### 🏢 Institutional Admin
- **Registry Management:** Manage Sessions, Classes, Subjects, and Staff.
- **HR & Payroll:** Track staff attendance, manage leave requests, and process payroll.
- **Security & Medical:** Log visitor entry/exit and track student health incidents.

---

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) (Database)
- [Git](https://git-scm.com/)

### Step-by-Step Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ProfHezzy/AdvancedSMS.git
   cd asms
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/asms_db"
   NEXTAUTH_SECRET="your-super-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   # Optional: Seed the database with mock data
   npm run db:seed
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
├── src
│   ├── actions       # Server Actions (Backend Logic)
│   ├── app           # Next.js App Router (Pages & Layouts)
│   │   ├── (auth)    # Authentication Routes
│   │   ├── dashboard # Role-based Dashboards
│   │   │   ├── admin
│   │   │   ├── teacher
│   │   │   ├── student
│   │   │   ├── parent
│   │   │   └── ...
│   │   └── page.tsx  # Landing Page
│   ├── components    # Reusable UI Components
│   │   ├── ui        # Shadcn Primitives (Button, Card, etc.)
│   │   └── ...
│   ├── lib           # Utilities & Helpers
│   └── config        # App Constants & Navigation
├── prisma            # Database Schema & Seeds
├── public            # Static Assets
└── ...
```

---

## 👥 Authors & Maintainers

**Hezekiah Olawale Ojenike**  
**hezekiahonline94@gmail.com**
**+234-814-027-2765**

- **Product Vision:** Cross-functional Enterprise Team
- **Development:** Full-Stack Engineering Division

For support or contributions, please contact the development team internally.

---

## 🔐 Default Credentials (Dev Mode)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@school.com` | `admin123` |
| **Teacher** | `teacher@school.com` | `teacher123` |
| **Student** | `student@school.com` | `student123` |
| **Parent** | `parent@school.com` | `parent123` |

---

> © 2025-2026 Advanced School Management System. All Rights Reserved.