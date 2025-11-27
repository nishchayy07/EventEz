# 🎟️ EventEz

![EventEz Banner](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=300&section=header&text=EventEz&fontSize=90)

<div align="center">

  **The Ultimate Platform for Nightlife, Sports, and Event Booking.**
  
  [![Vercel App](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://your-project-link.vercel.app)
  [![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
  
</div>

---

## 📖 About

**EventEz** is a modern, full-stack event booking application designed to simplify the discovery and booking of entertainment events. Whether you are looking for a high-energy **Nightlife** experience, a **Comedy Show**, or a **Sports Match** (like the Cricket World Cup), EventEz provides a seamless interface to browse, view details, and secure your spot.

Built with performance and user experience in mind, it features a sleek dark-mode UI, secure authentication, and real-time data fetching.

## ✨ Key Features

* **Dynamic Event Categories:** Browse specifically by Nightlife, Sports, Comedy, or Theatre.
* **Detailed Event Pages:** View pricing, dates, venues, and descriptions.
* **Search & Filtering:** Find exactly what you are looking for with category filters.
* **Secure Authentication:** User sign-up and login handled securely via Clerk.
* **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop.
* **Modern UI/UX:** A visually stunning interface with gradient accents and smooth transitions.

---

## 📸 Screenshots

| Landing Page | Event Details |
|:---:|:---:|
| <img src="./screenshots/home.png" alt="Landing Page" width="400"/> | <img src="./screenshots/details.png" alt="Event Details" width="400"/> |

| Category Filter | Mobile View |
|:---:|:---:|
| <img src="./screenshots/category.png" alt="Category Filter" width="400"/> | <img src="./screenshots/mobile.png" alt="Mobile View" width="400"/> |

---

## 🛠️ Tech Stack

### Frontend
* ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) **React.js** - UI Library
* ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) **Tailwind CSS** - Styling

### Backend & Services
* ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white) **Node.js** - Runtime Environment
* ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat-square) **Express.js** - API Framework
* ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white) **MongoDB** - Database
* ![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk&logoColor=white) **Clerk** - Authentication

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites
* Node.js installed
* MongoDB URI
* Clerk API Keys

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/EventEz.git](https://github.com/your-username/EventEz.git)
    cd EventEz
    ```

2.  **Install Dependencies**
    ```bash
    # Install backend dependencies
    cd server
    npm install

    # Install frontend dependencies
    cd ../client
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in both `client` and `server` folders.

    *Client .env:*
    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
    NEXT_PUBLIC_API_URL=http://localhost:5000
    ```

    *Server .env:*
    ```env
    MONGO_URI=your_mongodb_connection_string
    PORT=5000
    ```

4.  **Run the App**
    ```bash
    # Run Backend
    cd server
    npm start

    # Run Frontend (in a new terminal)
    cd client
    npm run dev
    ```

---

## 🔮 Future Improvements

* Integration of Payment Gateway (Razorpay/Stripe).
* User Dashboard for booking history.
* Admin Panel for adding new events.
---

<div align="center">
  Made with ❤️
</div>
