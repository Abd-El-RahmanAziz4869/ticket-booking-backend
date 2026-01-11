# 🎟️ Ticket Booking System (Backend)

A production-ready **Ticket Booking Backend** built with **Node.js, Express, MongoDB (Replica Set)**  
designed to handle **high concurrency**, **ACID transactions**, and **safe seat booking**.

---

##  Features

- JWT Authentication & Role-based Access (Admin / User)
- Event & Seat Management
- Temporary Seat Reservation with **TTL**
- ACID-safe Booking using **MongoDB Transactions**
- Stripe Payment Integration (Test Mode)
- Double booking prevention
- Dockerized with MongoDB Replica Set
- Clean Architecture (Controller / Service / Model)

---

##  Core Problem Solved

> Preventing double booking under high concurrency while keeping data consistent.

**Solution:**
- MongoDB Replica Set
- Multi-document transactions
- Temporary seat reservations with expiration (TTL)

---

##  Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- MongoDB Transactions (ACID)
- JWT Authentication
- Stripe (Test Mode)
- Docker & Docker Compose

---
 -- Environment Variables

Create .env file:

PORT=3000
JWT_SECRET=supersecret
MONGO_URI=mongodb://mongo1:27017,mongo2:27017,mongo3:27017/ticketing?replicaSet=rs0
STRIPE_SECRET_KEY=sk_test_xxxxxxxxx

 -- Run with Docker
docker-compose up -d --build

 -- Initialize MongoDB Replica Set (First time only)
docker exec -it mongo1 mongosh

rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
})

 -- API Testing (Postman)
Booking Flow Order:

Register

Login

Create Event (Admin)

Get Seats

Create Reservation

Create Payment Intent

Confirm Booking

 -- ACID Booking Flow

Seats reserved temporarily

Payment confirmed

Seats + booking saved in single transaction

Any failure → automatic rollback

Important Notes

Reservations expire automatically using MongoDB TTL

JWT must be refreshed after role changes

Stripe runs in test mode

Why This Project?

Demonstrates real-world backend challenges

High-concurrency safe design

Interview-ready system design

Suitable for production extension

 -- Author

Abd Al Rahman Aziz
Backend / Full-Stack Developer

