<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

---

## 🚀 Slooze Backend Take-Home Assignment

This repository contains my implementation for the Slooze backend evaluation, focusing on **Role-Based Access Control (RBAC)** and automated **Multi-Tenant Country Data Isolation** using NestJS, Passport JWT, and Prisma with PostgreSQL.

### 🎯 Implemented Core Logic
* **Authentication Pipeline:** Secure login endpoints creating signed JWT access tokens with a custom Passport Strategy mapping layout.
* **Contextual Data Isolation:** Enforces multi-tenant restrictions directly inside the Prisma query layer. Users with a `MANAGER` or `MEMBER` role flag are dynamically restricted to records belonging to their assigned country.
* **Admin Bypass Matrix:** Global administrators (`ADMIN`) automatically bypass the localized data filters to pull all international entries org-wide.

---

## 🛠️ Project Setup & Installation

### 1. Install Dependencies
```bash
$ npm install
2. Environment Setup
Create a .env file in the root backend directory:

Code snippet
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/slooze_db?schema=public"
JWT_SECRET="supersecret"
3. Database Migration & Automated Seeding
Sync your local PostgreSQL database schemas and run the automated Prisma script to generate your test users and order entries:

Bash
$ npx prisma migrate dev --name init
4. Run the Server (Watch Mode)
Bash
$ npm run start:dev
The server will stand up and start listening at http://localhost:3000.

🧪 Postman Evaluation Guide (Testing Seed Data)
To verify the RBAC and geographic data isolation sequences on your machine, utilize these pre-seeded system profiles:

👤 1. Test Credentials
Admin (Global Access): nick.fury@slooze.xyz / password123

Team Member (India): thanos@slooze.xyz / password123

Team Member (America): travis@slooze.xyz / password123

🔄 2. Verification Workflow Steps
Login: Submit a POST request to http://localhost:3000/auth/login using any set of credentials above to get an access_token.

Fetch Restricted Data: Send a GET request to http://localhost:3000/orders putting that token into the Authorization -> Bearer Token field.

Testing with Thanos will securely return only the Indian order array object.

Testing with Travis will securely return only the American order array object.

Testing with Nick Fury will bypass country context matching entirely to print all global records side-by-side.

License
Nest is MIT licensed.