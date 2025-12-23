<div align="center">

# 🎟️ EventEz

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:667eea,100:764ba2&height=220&section=header&text=EventEz&fontSize=80&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Book%20Events.%20Live%20Experiences.&descSize=20&descAlignY=55" width="100%"/>

### ✨ The Ultimate Platform for Nightlife, Sports & Event Booking ✨

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-EventEz-667eea?style=for-the-badge)](https://www.eventez.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-nishchayy07-181717?style=for-the-badge&logo=github)](https://github.com/nishchayy07/EventEz)
[![License](https://img.shields.io/badge/License-MIT-00d4aa?style=for-the-badge)](LICENSE)

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-qr-ticket-validation">QR Validation</a>
</p>

</div>

---

## 🎯 About

**EventEz** is a modern, full-stack event booking platform that revolutionizes how you discover and book entertainment events. From electrifying **Nightlife** experiences to thrilling **Sports matches** and hilarious **Comedy shows** — EventEz delivers a seamless, intuitive booking experience.

> 💡 **What makes us different?** Real-time seat selection, secure QR-based ticket validation, and a stunning dark-mode UI that users love!

---

## ⚡ Features

<table>
<tr>
<td width="50%">

### 🎪 Event Discovery
- **Dynamic Categories** — Browse Nightlife, Sports, Comedy & Movies
- **Smart Search** — Find events with powerful filters
- **Location-Based** — Discover events near you
- **Detailed Pages** — Pricing, dates, venues & descriptions

</td>
<td width="50%">

### 🎫 Booking Experience
- **Interactive Seat Selection** — Choose your perfect spot
- **Real-time Availability** — See seats update live
- **Secure Payments** — Safe transaction handling
- **Instant Confirmation** — Get your tickets immediately

</td>
</tr>
<tr>
<td width="50%">

### 🔐 Security & Auth
- **Clerk Authentication** — Secure sign-up & login
- **QR Ticket Validation** — One-time scan tickets
- **Staff Scanner Portal** — Streamlined entry management
- **Fraud Prevention** — Tickets expire after first scan

</td>
<td width="50%">

### 🎨 User Experience
- **Dark Mode UI** — Easy on the eyes
- **Responsive Design** — Mobile, Tablet & Desktop
- **AI Chatbot** — Instant help when you need it
- **Smooth Animations** — Polished micro-interactions

</td>
</tr>
</table>

---

## 🎯 QR Ticket Validation

<div align="center">

### 🔒 One-Time Scan Security System

</div>

One of EventEz's standout features is the **intelligent QR ticket validation system**. Here's how it works:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User Books    │────▶│  QR Generated   │────▶│  Ticket Ready   │
│     Event       │     │   Instantly     │     │    for Entry    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Entry Denied   │◀────│ Marked as Used  │◀────│  Staff Scans    │
│   (If Reused)   │     │  in Database    │     │   QR Code       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

| State | Description |
|:---:|:---|
| ✅ **Valid** | Fresh ticket, ready for entry — shows green confirmation |
| ❌ **Expired** | Already scanned once — shows red "Ticket Already Used" |
| ⚠️ **Invalid** | Fake/tampered QR — shows error message |

> 🛡️ **This prevents ticket fraud and ensures each booking is used only once!**

<div align="center">

| QR Code Generated | First Scan (Valid ✅) | Second Scan (Expired ❌) |
|:---:|:---:|:---:|
| <img src="./screenshots/qr.jpeg" alt="QR Code" width="250"/> | <img src="./screenshots/qr-valid.jpeg" alt="Valid QR" width="250"/> | <img src="./screenshots/qr-expired.jpeg" alt="Expired QR" width="250"/> |

</div>

---

## 📸 Screenshots

<div align="center">

### 🏠 Landing Page
<img src="./screenshots/home.jpeg" alt="Home Page" width="800"/>

---

### 🌃 Event Categories

| Nightlife Events | Sports Events |
|:---:|:---:|
| <img src="./screenshots/nightlife.jpeg" alt="Nightlife" width="400"/> | <img src="./screenshots/sports.png" alt="Sports" width="400"/> |

| Movies | Cricket Booking |
|:---:|:---:|
| <img src="./screenshots/movies.jpeg" alt="Movies" width="400"/> | <img src="./screenshots/cricket.jpeg" alt="Cricket" width="400"/> |

---

### 🎫 Booking Flow

| Event Details | Payment |
|:---:|:---:|
| <img src="./screenshots/event-details.jpeg" alt="Event Details" width="400"/> | <img src="./screenshots/payment.jpeg" alt="Payment" width="400"/> |

| Badminton Court Selection | Location Selector |
|:---:|:---:|
| <img src="./screenshots/badminton-court.jpeg" alt="Badminton Court" width="400"/> | <img src="./screenshots/location.jpeg" alt="Location" width="400"/> |

---

### 🔍 Search & AI Chatbot

| Search Box | AI Chatbot |
|:---:|:---:|
| <img src="./screenshots/search-box.jpeg" alt="Search" width="400"/> | <img src="./screenshots/chatbot.jpeg" alt="Chatbot" width="400"/> |

</div>

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

### Services
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18 or higher)
- **MongoDB** (Atlas or local instance)
- **Clerk Account** (for authentication)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/nishchayy07/EventEz.git
cd EventEz

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Environment Setup

Create `.env` files in both `client` and `server` directories:

<details>
<summary>📁 <b>client/.env</b></summary>

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000
```
</details>

<details>
<summary>📁 <b>server/.env</b></summary>

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
CLERK_SECRET_KEY=your_clerk_secret_key
```
</details>

### Run the Application

```bash
# Terminal 1 - Start Backend
cd server
npm start

# Terminal 2 - Start Frontend
cd client
npm run dev
```

🎉 **Open [http://localhost:5173](http://localhost:5173) and you're ready to go!**

---

## 📂 Project Structure

```
EventEz/
├── 📁 client/                 # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/     # Reusable UI components
│   │   ├── 📁 pages/          # Page components
│   │   ├── 📁 context/        # React Context
│   │   └── 📁 lib/            # Utility functions
│   └── 📄 package.json
│
├── 📁 server/                 # Express Backend
│   ├── 📁 controllers/        # Route handlers
│   ├── 📁 models/             # MongoDB schemas
│   ├── 📁 routes/             # API routes
│   └── 📄 package.json
│
├── 📁 screenshots/            # App screenshots
└── 📄 README.md
```

---

## 🔮 Future Roadmap

- [ ] 💳 Payment Gateway Integration (Razorpay/Stripe)
- [ ] 📊 User Dashboard with booking analytics
- [ ] 🎛️ Advanced Admin Panel
- [ ] 📧 Email notifications & reminders
- [ ] ⭐ Event reviews & ratings

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it for your own projects!

---

<div align="center">

### ⭐ Star this repo if you found it helpful!

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:667eea,100:764ba2&height=120&section=footer"/>

**Made with ❤️ by [Nishchay](https://github.com/nishchayy07)**

</div>
