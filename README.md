# TransitOps Hackathon Project

A MERN stack transport operations platform for fleet management.

## ⚠️ Important Note About Branches
Currently, the `main` branch has the code from:
- Aakash (Auth & Trips Backend)
- Krish (Maintenance, Fuel, Dashboard Backend)
- Rudra (React Frontend)

**Chandan's code (Vehicles & Drivers Backend) is currently missing from the `main` branch.** You will need to ensure Chandan successfully pushes his code or merges his branch into `main`, and then run `git pull` again so the `Vehicle` and `Driver` models exist for the server to work completely.

---

## How to Run the Project Locally

You will need **two terminal windows** open simultaneously—one for the backend server and one for the React frontend.

### Prerequisites
Make sure you have MongoDB running locally on your machine on the default port. The backend will try to connect to `mongodb://localhost:27017/transitops`.

### 1. Start the Backend (Terminal 1)
Open a terminal in the root folder of this repository (where this README is located) and run:
```bash
# Install backend dependencies
npm install

# Start the Express server
node server/index.js
```
*You should see `Server started on port 5000` and `MongoDB Connected...`*

### 2. Start the Frontend (Terminal 2)
Open a new terminal window, navigate into the `client` folder, and start the Vite development server:
```bash
# Go to the frontend folder
cd client

# Install frontend dependencies
npm install

# Start the React app
npm run dev
```
*Vite will give you a local URL (usually `http://localhost:5173`). Click it to open the app in your browser!*