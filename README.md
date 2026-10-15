# NEC Pulse — AI Official Letter Writing Assistant & Student Suite

> **Narasaraopeta Engineering College (Autonomous)**  
> Department of Computer Science and Engineering • JNTUK R23 Regulation  
> *A production-ready, cross-platform academic drafting assistant and student companion.*

---

## 📌 Overview

**NEC Pulse** is a specialized web application engineered for students of **Narasaraopeta Engineering College (Autonomous)**. It combines an **AI-powered institutional letter drafting engine** with a daily academic management dashboard:

1. **AI Official Letter Writing Assistant**: Formulates university-grade formal letters across three core categories (**Complaint Box**, **Teacher's Feedback**, and **Various Types of Leave Letters**) on an authentic printable letterhead with reference numbers and signature endorsements.
2. **Interactive 3D Knowledge Tome**: A procedural Three.js 3D academic book featuring smooth damping, gold corner guards, orbital knowledge ring, and user drag/hover parallax.
3. **Editable Class Timetable (9:10 AM – 4:00 PM)**: Day-by-day period allocation covering core theory lectures, lab sessions, and breaks with live class tracking.
4. **Smart Bag-Packing Checklist**: Real-time readiness gauge with daily required textbooks, lab record books, calculator, and ID badge.
5. **Study Goals & Priority Tracker**: Academic milestone planner with priority badges, deadlines, and completion analytics.
6. **Dual Daily Reminders**: Night-before packing reminder (9:00 PM) and morning readiness alert (8:50 AM) powered by the native **Browser Notification API** and a synthetic **Web Audio API** harmonic chime.

---

## 🚀 Key Features

### 1. AI Official Letter Writing Assistant
- **Three Core Academic Categories**:
  - **Complaint Box**: Hostel & Mess hygiene, computer lab terminal failures, college bus route delays, and classroom projector issues.
  - **Teacher's Feedback**: Lecture pace, guided coding exercises, lab debugging mentorship, and faculty commendations.
  - **Various Types of Leave Letters**: Medical leave with doctor's notes, On-Duty (OD) for hackathons and sports, emergency family leave, hostel weekend night outpass, and fee installment extensions.
- **Dynamic Context Controls**: Automatically alters form fields based on category (e.g., date ranges, total days, physician info, incident location, teacher name, and custom notes).
- **Institutional Document Preview Canvas**: Styled like an official letterhead with ISO certifications, NAAC 'A+' accreditation, Department heading, auto-generated reference codes (`NEC/AUTO/...`), and student/mentor signature lines.
- **Actions & Export**:
  - **Copy to Clipboard** with animated check confirmation.
  - **Download as PDF / Print** via dedicated `@media print` stylesheets (no screen UI clipping).
  - **AI Polish** powered by `@google/genai` (with intelligent offline template fallback).
  - **Direct Canvas Editing** toggle to modify paragraphs directly on the document sheet.

### 2. Subtle 3D Academic Tome (Three.js)
- 100% procedural WebGL rendering (zero external `.glb`, `.png`, or 404 asset dependencies).
- Metallic PBR materials with ACESFilmic tone mapping.
- Interactive pointer parallax tilt, drag-to-spin, and exploded view toggle.
- Automatically respects system `prefers-reduced-motion` settings.

### 3. Semester 3 Editable Timetable
- Monday through Saturday schedule from **9:10 AM to 4:00 PM**.
- 7 academic periods, 1 morning tea break (11:00 AM – 11:10 AM), and 1 lunch break (12:50 PM – 1:40 PM).
- Click any period card to customize the subject, faculty in-charge, hall, or room number.

### 4. Bag-Packing Checklist with Progress Tracker
- Synchronized with required materials (College ID card, DSA lab record book, Java assignment, scientific calculator, stationery, apron).
- Visual progress bar with milestone badge (e.g., *100% Ready*).
- Support for adding custom items with category labels (Mandatory, Lab Record, Textbook, Notebook, Tool).

### 5. Automated Reminders & Native Browser Notifications
- **Night-Before Packing Reminder**: Defaults to 9:00 PM (1 hour before 10:00 PM bedtime).
- **Morning Readiness Alert**: Defaults to 8:50 AM (20 minutes before 9:10 AM college start).
- Real browser desktop notifications using `Notification.requestPermission()`.
- Harmonic synthesized audio chime synthesized on-the-fly using the Web Audio API.
- Test notification button with instant feedback.

### 6. Student Profile & Semester 3 Subjects Catalog
- Searchable catalog for R23 Semester 3 subjects:
  - *Data Structures & Algorithms (23CS301)*
  - *OOP through Java (23CS302)*
  - *Discrete Mathematical Structures (23BS301)*
  - *Digital Logic Design (23EC303)*
  - *Data Structures Lab (23CS303)*
  - *Java Programming Lab (23CS304)*
  - *Constitution of India & Professional Ethics (23MC301)*
- Editable personal notes for each subject, preserved in `localStorage`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Styling & Design** | Tailwind CSS v4, Lucide Icons, Plus Jakarta Sans, Cinzel |
| **3D Graphics** | Three.js (Procedural geometries, PBR materials, ACES tone mapping) |
| **AI Integration** | Google GenAI SDK (`@google/genai`) using `gemini-3.8-flash` |
| **Backend & API** | Node.js, Express, TSX |
| **Audio & Device APIs** | Web Audio API (Chime synthesis), HTML5 Web Notification API |
| **Data Persistence** | Browser `localStorage` with export and reset support |

---

## 📁 Project Architecture

```
├── .env.example                       # Sample environment variable declarations
├── index.html                         # Entry HTML with print styles & typography
├── metadata.json                      # AI Studio capabilities and applet metadata
├── package.json                       # Scripts and project dependencies
├── server.ts                          # Express server with Gemini API routes & Vite proxy
├── tsconfig.json                      # TypeScript configuration
├── vite.config.ts                     # Vite + Tailwind build setup
└── src/
    ├── main.tsx                       # React DOM entry point
    ├── App.tsx                        # Master application state & view orchestrator
    ├── index.css                      # Tailwind stylesheet
    ├── types/
    │   └── index.ts                   # Type definitions for Profile, Letters, Timetable, etc.
    ├── data/
    │   └── mockData.ts                # Default R23 subjects, 6-day timetable, and checklist
    ├── utils/
    │   ├── letterTemplates.ts         # Institutional letterhead generator & presets
    │   └── notificationAudio.ts       # Synthetic Web Audio harmonic chimes
    └── components/
        ├── Navbar.tsx                 # Header navigation, theme toggle, and profile pill
        ├── ThreeDStudentCompanion.tsx # Subtle procedural 3D Academic Tome (Three.js)
        ├── LetterWriter/
        │   └── LetterWriterView.tsx   # Letter writing assistant & preview canvas
        ├── Timetable/
        │   └── TimetableSection.tsx   # 9:10 AM - 4:00 PM editable timetable
        ├── BagChecklist/
        │   └── BagChecklistSection.tsx# Packing checklist with progress bar
        ├── StudyGoals/
        │   └── StudyGoalsSection.tsx  # Academic milestone & goal tracker
        ├── Reminders/
        │   └── ReminderSettingsModal.tsx # Browser notifications & reminder time configs
        ├── Profile/
        │   └── ProfileModal.tsx       # Student profile & credentials editor
        └── Subjects/
            └── SubjectCatalogModal.tsx# Searchable Semester 3 subjects catalog
```

---

## ⚙️ Installation & Development Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` (or configure secrets in your deployment dashboard):
```bash
cp .env.example .env
```
Ensure `GEMINI_API_KEY` is configured:
```env
GEMINI_API_KEY="your_api_key_here"
PORT=3000
```
*(Note: If `GEMINI_API_KEY` is not provided, the application automatically falls back to its deterministic institutional template engine without interruptions).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 📄 API Endpoints

### `POST /api/letter/generate`
Generates a formal college letter based on context parameters.
- **Request Body**:
  ```json
  {
    "category": "leave",
    "subCategory": "Medical Leave",
    "studentName": "Kowshik Varma",
    "rollNumber": "23471A0589",
    "collegeName": "Narasaraopeta Engineering College (Autonomous)",
    "branch": "Computer Science & Engineering",
    "yearSemester": "Year 2, Semester 3",
    "section": "B",
    "recipientTitle": "The Head of Department",
    "recipientDepartment": "Department of Computer Science & Engineering",
    "subject": "Application for Medical Leave",
    "dateRange": "October 15, 2026 to October 18, 2026",
    "tone": "Formal & Respectful",
    "contextDetails": {
      "reason": "Diagnosed with acute bronchitis requiring recuperation",
      "doctorOrEvent": "Dr. R. K. Varma, General Physician"
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "source": "gemini_ai",
    "letter": "REF NO: NEC/AUTO/CSE/2026/REF-4192\nDATE: 15 October 2026\n..."
  }
  ```

### `POST /api/letter/enhance`
Refines an existing draft for academic formality, clarity, and tone.
- **Request Body**:
  ```json
  {
    "originalContent": "Letter text here...",
    "instruction": "Enhance tone to be more formal and persuasive"
  }
  ```

---

## 🔒 Notes on Privacy & Prototype Limitations

1. **Front-End Data Persistence**: All student profile details, modified timetables, custom checklist items, and personal notes are stored locally in the user's browser via `localStorage`. No private student data is transmitted to external servers except letter generation prompts sent to the Gemini API proxy.
2. **Notification Delivery**: Browser notifications operate using standard Web Notification APIs and trigger when the web page is open in a tab or running in the background. Full delivery when the browser application is completely closed requires server push credentials (e.g., Firebase Cloud Messaging).
3. **Official Verification**: This application serves as a high-fidelity productivity assistant and student prototype. Official letter submissions and timetable updates should be cross-verified with the Narasaraopeta Engineering College examination and department offices.

---

## 📜 License
Licensed under the Apache-2.0 License.
