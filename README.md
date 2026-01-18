# Escrow Admin Panel (zkSync Era) — Backend + Frontend + Smart Contract

This project is a simple **escrow payment system** with:
- **Smart Contract (Escrow.sol)** deployed on **zkSync Era**
- **Backend (NestJS)** acting as the **Admin** (release/refund)
- **Frontend (Next.js)** acting as the **UI** for Client/Seller/Admin actions

>  Real-life idea: Like Fiverr/Upwork escrow — client funds first, seller marks done, admin releases/refunds.

---

## Features

### On-chain (Wallet actions)
- **Fund (Client)**: Client approves token + locks funds in escrow contract
- **Mark Completed (Seller)**: Seller signals work completed (status update only)

### Admin (Backend actions)
- **Admin Release**: Backend admin wallet releases funds to seller (only if COMPLETED)
- **Admin Refund**: Backend admin wallet refunds client (FUNDED/COMPLETED/DISPUTED)

### Deal tracking (DB)
- Deals stored in DB (Prisma)
- Tx hashes saved for traceability

---

## Project Structure

Prisma DB
npx prisma generate
npx prisma migrate dev

Run backend
npm run start:dev


Backend runs at:

http://localhost:3001

3) Frontend Setup (Next.js)
Install
cd frontend
npm install
