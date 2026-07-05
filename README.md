<p align="center">
  <img src="https://raw.githubusercontent.com/jlooper/practicebuddy-web/main/public/lyre.png" alt="PracticeBuddy Logo" width="200" />
</p>

<h1 align="center">PracticeBuddy</h1>

<p align="center">
  <strong>AI-powered music practice platform for modern educators and students.</strong>
</p>

<p align="center">
  <a href="https://github.com/jlooper/practicebuddy-web">GitHub</a> ·
  <a href="#-key-features">Features</a> ·
  <a href="#-getting-started">Getting Started</a> ·
  <a href="#-architecture">Architecture</a>
</p>

<br/>

PracticeBuddy is an open-source music education platform built by [Beanpot Studio](https://beanpotstudio.com) that empowers teachers to create, manage, and track music practice assignments. Students can record practice sessions, track progress, and earn stickers as rewards — making music practice engaging and measurable.

---

## ✨ Key Features

### 🎵 Practice Session Recording
Students log practice sessions with duration tracking, instrument selection, and audio recordings. Built-in timer and waveform visualization make practice sessions interactive and focused.

### 👩‍🏫 Dual Portal System
- **Teacher Portal**: Create classes, manage rosters, assign practice goals, review student submissions, and track class-wide progress.
- **Student Portal**: Join classes, log practice sessions, view assignments, track personal progress, and earn sticker rewards.

### 🎯 Practice Goals & Assignments
Teachers can create practice goals with specific targets (duration, frequency) and assign them to individual students or entire classes. Students see their goals and track completion.

### 🏆 Sticker Reward System
Students earn stickers for completing practice sessions and achieving goals. A fun, visual reward system that motivates consistent practice.

### 📊 Comprehensive Analytics
Track student performance with detailed dashboards, practice history charts, and class-wide progress metrics. Teachers get actionable insights at a glance.

### 🎸 Instrument Library
Built-in instrument selection with visual icons covering piano, guitar, violin, flute, cello, trumpet, and many more. Students select their instrument when logging practice.

### 🎧 Audio Recording & Playback
Students can record audio snippets during practice sessions. Audio files are stored securely via Cloudinary for easy playback and teacher review.

### 💬 Built-in Communication
Teachers and students can communicate securely through the platform's messaging system.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- A Firebase project (Firestore, Authentication, Storage)
- A Cloudinary account (for audio file storage)
- (Optional) A Stripe account for payment processing

### Installation

```bash
# Clone the repository
git clone https://github.com/jlooper/practicebuddy-web.git
cd practicebuddy-web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file with the following:

```env
PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
VITE_USE_FIREBASE_EMULATOR=false
PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Development

```bash
# Start the development server
npm run dev

# Run unit tests
npm test

# Run end-to-end tests
npm run test:e2e
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | [Astro](https://astro.build/) + [Vue.js 3](https://vuejs.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Backend & Database** | [Firebase](https://firebase.google.com/) (Firestore, Auth, Storage) |
| **Media Storage** | [Cloudinary](https://cloudinary.com/) |
| **Payments** | [Stripe](https://stripe.com/) |
| **Charts** | Chart.js |
| **Testing** | Vitest (unit), Playwright (e2e) |
| **Deployment** | Netlify |

### Firebase Data Model

```
users            → Profiles, roles (student/teacher), class enrollments
classes          → Course metadata, teacher info, access codes
enrollments      → Student-class relationships with status tracking
practiceSessions → Practice logs (duration, instrument, audio, timestamps)
practiceGoals    → Teacher-created goals with targets and assignments
assignments      → Goal-to-student mappings with completion status
stickers         → Earned sticker records for student achievements
activities       → Audit log of platform events (enrollments, practice completions)
```

### Project Structure

```
src/
├── components/           # Vue.js components
│   ├── ui/               # Reusable UI components (Header, Footer, Modals)
│   ├── StudentDashboard/ # Student-facing components (timer, charts, cards)
│   └── TeacherDashboard/ # Teacher-facing components (roster, goals, assignments)
├── composables/          # Vue composables (useAuth, useErrorHandler)
├── layouts/              # Astro layouts
├── lib/                  # Firebase config, auth, Cloudinary, Stripe, instruments
├── pages/                # Astro pages (home, about, features, pricing, contact)
├── styles/               # Global CSS
└── test/                 # Test files (unit tests, enrollment tests, auth tests)
```

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run end-to-end tests
npm run test:e2e
```

---

## 🛠️ Usage

### For Teachers

1. **Create a Class** — Set up a course with a name and generate a unique access code.
2. **Set Practice Goals** — Create practice goals with duration targets and frequency requirements.
3. **Manage Enrollments** — Share the unique class code with students; approve or manage enrollments.
4. **Review Practice Sessions** — View student practice logs, audio recordings, and progress.
5. **Award Stickers** — Recognize student achievements with digital sticker rewards.

### For Students

1. **Join a Class** — Use a class code to enroll in a teacher's course.
2. **Log Practice Sessions** — Start the practice timer, select your instrument, and record audio.
3. **Track Progress** — View your practice history, goals, and earned stickers on your dashboard.
4. **Complete Goals** — Meet practice targets to earn stickers and achieve milestones.

---

## 🌐 Deployment

PracticeBuddy is pre-configured for deployment on [Netlify](https://www.netlify.com/) via `@astrojs/netlify`. Deploy by connecting your repository or using the CLI:

```bash
npm run build
npx netlify deploy --prod
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**.

You are free to share and adapt the material for **non-commercial** purposes, as long as you provide attribution and distribute any adaptations under the same license. Commercial use requires a separate license from [Beanpot Studio](https://beanpotstudio.com).

See the [LICENSE](LICENSE) file for the full license text.

---

## 🙏 Acknowledgments

- Built with [Astro](https://astro.build/) and [Vue.js](https://vuejs.org/)
- Backend by [Firebase](https://firebase.google.com/)
- Media storage by [Cloudinary](https://cloudinary.com/)
- Payments by [Stripe](https://stripe.com/)

---

## 📬 Contact

- **Author**: Jen Looper via Beanpot Studio — [beanpotstudio.com](https://beanpotstudio.com)

---

*PracticeBuddy — Making music practice engaging, trackable, and fun.*