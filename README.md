# 🚛 TransitOps – Smart Transport Operations Platform

TransitOps is a full-stack MERN-based fleet and transport management platform built during a hackathon. It helps transport companies efficiently manage vehicles, drivers, trips, maintenance, and operational analytics while enforcing real-world business rules to improve safety, utilization, and operational efficiency.

---

# 📌 Problem Statement

Fleet operators often struggle with:

- Manual vehicle allocation
- Driver scheduling conflicts
- Vehicle overloading
- Poor maintenance tracking
- Limited operational visibility
- Inefficient fleet utilization

TransitOps solves these challenges by providing a centralized platform to manage fleet operations with automated business rule validation.

---

# ✨ Features

## 🚚 Vehicle Management

- Add, edit, delete vehicles
- Unique registration number validation
- Track vehicle status
  - Available
  - On Trip
  - In Shop
  - Retired
- Store maximum load capacity
- Search and filter vehicles

---

## 👨‍✈️ Driver Management

- Register drivers
- Track driving license expiry
- Manage driver availability
- Driver status management
  - Available
  - On Trip
  - Off Duty
  - Suspended

---

## 🛣️ Trip Management

### Business Rules

- Vehicle must be available
- Driver must be available
- Cargo weight cannot exceed vehicle capacity
- Prevent duplicate vehicle assignment
- Prevent duplicate driver assignment

### Trip Lifecycle

- Create Trip
- Dispatch Trip
- Complete Trip
- Cancel Trip

Automatic status synchronization:

| Action | Vehicle | Driver |
|---------|----------|---------|
| Dispatch | On Trip | On Trip |
| Complete | Available | Available |
| Cancel | Available | Available |

---

## 🔧 Maintenance Management

- Create maintenance logs
- Close maintenance logs
- Automatically update vehicle status
- Maintain maintenance history

Vehicle status changes:

- Available → In Shop
- In Shop → Available

---

## ⛽ Fuel & Expense Tracking

- Record fuel logs
- Record operational expenses
- Vehicle-wise expense history

---

## 📊 Dashboard

Real-time operational KPIs including:

- Total Vehicles
- Active Vehicles
- Available Vehicles
- Vehicles In Maintenance
- Total Drivers
- Drivers Available
- Drivers On Trip
- Active Trips
- Pending Trips
- Completed Trips

---

## 🔐 Authentication & Authorization

Secure authentication using JWT.

### Supported Roles

- Fleet Manager
- Driver
- Safety Officer
- Financial Analyst

Role-based access ensures users only access relevant features.

---

# 🏗️ Tech Stack

## Frontend

- React
- Vite
- JavaScript
- HTML5
- CSS3

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Authentication

- JWT
- bcryptjs

---

# 📂 Project Structure

```
TransitOps
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── server.js
│
├── README.md
└── .gitignore
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/<your-repository>.git

cd transitops-hackathon-
```

---

## Backend Setup

```bash
cd server

npm install

npm run dev
```

---

## Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

# 🌐 Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000

MONGO_URI=mongodb://localhost:27017/transitops

JWT_SECRET=your_secret_key
```

---

# 🔄 System Workflow

```
Vehicle Available
        │
        ▼
Driver Available
        │
        ▼
Create Trip
        │
        ▼
Validate Vehicle Capacity
        │
        ▼
Dispatch Trip
        │
        ├──────────────┐
        ▼              ▼
Vehicle On Trip   Driver On Trip
        │              │
        └──────┬───────┘
               ▼
        Complete Trip
               │
               ▼
Vehicle Available
Driver Available
```

---

# ✅ Business Rules

### Vehicle Rules

- Registration number must be unique.
- Vehicle cannot carry cargo exceeding its maximum load capacity.
- Vehicles under maintenance cannot be dispatched.
- Retired vehicles cannot be assigned to trips.

### Driver Rules

- Driver must be available before trip assignment.
- A driver cannot be assigned to multiple active trips.
- License validity can be checked before dispatch.

### Trip Rules

- Driver and vehicle availability are verified before dispatch.
- Cargo weight validation is enforced.
- Vehicle and driver statuses are automatically synchronized.

### Maintenance Rules

- Creating a maintenance log sets the vehicle status to **In Shop**.
- Closing a maintenance log restores the vehicle to **Available**.

---

# 🧪 Testing

Sample verification workflow:

1. Add 2–3 vehicles.
2. Add 2–3 drivers.
3. Create a trip.
4. Dispatch the trip.
5. Verify vehicle and driver statuses.
6. Complete the trip.
7. Confirm dashboard KPI updates.
8. Create a maintenance log.
9. Verify vehicle enters **In Shop**.
10. Close maintenance log and confirm vehicle becomes **Available**.

---

# 🚀 Future Enhancements

- Live GPS Tracking
- Route Optimization
- AI-powered Fleet Analytics
- Predictive Maintenance
- Fuel Consumption Analytics
- Driver Performance Dashboard
- Notification System
- Mobile Application
- Google Maps Integration
- Reports & Export Functionality

# 👥 Contributors

This project was collaboratively developed during the **TransitOps Hackathon**.

| Name | Role / Contribution |
|------|----------------------|
| **Aakash Jayani** | *To be added* |
| **Rudra Patel** | *To be added* |
| **Chandan Shah** | *To be added* |
| **Krish Chaklasia** | *To be added* |


# 🤝 Contributing

Contributions are welcome.

# 📜 License

This project was developed for educational and hackathon purposes.

---

## ⭐ If you found this project useful, consider giving the repository a star!
