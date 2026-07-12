# TransitOps Hackathon Project 🚀

Welcome to **TransitOps**, a comprehensive Smart Transport Operations Platform built for the Odoo Hackathon 2026!

## 🎥 Video Pitch & Demonstration
[Watch our Automated UI Demo Video](https://raw.githubusercontent.com/aakashjayani19352-wq/transitops-hackathon-/main/demo_video.webp)

## 🌟 Overview
TransitOps is designed to streamline and automate the core operations of fleet management. Our platform handles everything from vehicle maintenance logs and driver assignments to fuel consumption tracking and trip planning. 

Built with a robust **Node.js/Express** backend and a lightning-fast **React/Vite** frontend, it provides a seamless experience for Fleet Managers, Safety Officers, Drivers, and Financial Analysts.

---

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS (via external UI library), Context API
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens), Bcrypt for password hashing
- **Deployment**: Vercel

---

## 📁 Project Structure
The repository is split into two main architectures to ensure clear separation of concerns:

### `client/` (Frontend)
- `src/components/`: Reusable React UI components (Sidebar, Layout).
- `src/pages/`: Main application views (Dashboard, Vehicles, Trips, Drivers, Login, Signup).
- `src/context/`: Global state management for authentication.
- `src/api/`: Centralized Axios configuration and HTTP interceptors.

### `server/` (Backend)
- `controllers/`: Core business logic for endpoints.
- `models/`: Mongoose schemas defining our database structures.
- `routes/`: Express route definitions.
- `validations/`: Joi validation schemas ensuring data integrity.
- `middleware/`: JWT authentication and error handling intercepts.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- MongoDB connection string

### 1. Clone the repository
```bash
git clone https://github.com/aakashjayani19352-wq/transitops-hackathon-.git
cd transitops-hackathon-
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the root of the project with:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=supersecretkey
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🛡️ Security & Validations
- Passwords are automatically hashed via Mongoose pre-save hooks.
- All incoming requests are validated against strict `Joi` schemas before hitting the database.
- Protected routes require a Bearer token issued during Login.

## 👥 Contributors
- Aakash Jayani (Team Leader)
- Krish Chaklasia
- Chandan Shah
- Rudra Patel
