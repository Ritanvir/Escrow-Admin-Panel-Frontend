Escrow Admin Panel (zkSync Era) — Backend + Frontend + Smart Contract + AI

This project is a full-stack escrow payment system with Blockchain, Backend, Frontend, Database, and AI Risk Scoring.

Smart Contract (Escrow.sol) deployed on zkSync Era

Backend (NestJS) acting as Admin + AI Risk Engine

Frontend (Next.js) acting as UI for Client / Seller / Admin

Database (PostgreSQL + Prisma)

AI (LangChain + OpenAI) for risk analysis

💡 Real-life idea: Like Fiverr / Upwork escrow — client funds first, seller completes work, admin releases or refunds.
🤖 AI adds fraud / risk detection before admin action.

🚀 Features
🔗 On-chain (Wallet actions)

Fund (Client)
Client approves ERC20 token and locks funds in escrow contract.

Mark Completed (Seller)
Seller marks work as completed (no funds move yet).

🛠 Admin (Backend actions)

Admin Release
Backend admin wallet releases funds to seller (only if status = COMPLETED).

Admin Refund
Backend admin wallet refunds client (FUNDED / COMPLETED / DISPUTED).

⚠️ Admin private key is never exposed to frontend.

🗄 Deal Tracking (Database)

Deals stored using Prisma + PostgreSQL

On-chain transaction hashes saved:

create

fund

complete

release

refund

🤖 AI Risk Scoring (NEW 🔥)

Before admin releases or refunds funds, the system can AI-score the deal.

What the AI does

Analyzes DB-only metadata (no private keys, no wallet signing)

Uses:

Seller deal history

Client deal history

Recent transaction patterns

Amount anomalies

Powered by LangChain + OpenAI

Risk Output

AI generates:

Risk Score (0–100)

Risk Level

LOW

MEDIUM

HIGH

Reasons (human-readable explanations)

Recommended Action

AUTO_APPROVE

REVIEW_MANUALLY

BLOCK

ech Stack
Blockchain

Solidity

zkSync Era

ERC20 tokens

Ethers.js

Backend

NestJS

Prisma ORM

PostgreSQL

LangChain

OpenAI API

Frontend

Next.js

Ethers.js

MetaMask / WalletConnect
