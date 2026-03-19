# Northstar Market

A polished full-stack ecommerce demo built with a React + TypeScript frontend and an Express + Sequelize backend. The project showcases a modern storefront experience with authentication, cart and checkout flows, favorites, order tracking, and an admin product management area.

## Overview

Northstar Market is organized as two apps inside a single repository:

- **`ecommerce-project/`** – customer-facing frontend built with Vite, React, and TypeScript.
- **`ecommerce-backend/`** – REST API and data layer powered by Express, Sequelize, and SQL.js.

The frontend consumes backend API routes for products, cart items, delivery options, orders, payment summary, and reset functionality. The backend also seeds demo data automatically when the database is empty.

## Key Features

### Customer experience
- Secure login-gated application flow.
- Product discovery with search support.
- Cart management with delivery option selection.
- Favorites saved per signed-in user.
- Checkout flow with payment summary data.
- Orders history and package tracking views.
- Light and dark theme toggle.

### Admin experience
- Dedicated product management route for admin users.
- Shared storefront and operational views inside one interface.

### Backend capabilities
- REST API for products, cart items, orders, delivery options, and payment summary.
- Automatic default data seeding on first run.
- Static asset serving for product and brand images.
- Frontend build serving support from the backend `dist/` directory.

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- Axios
- Vitest + Testing Library

### Backend
- Node.js
- Express
- Sequelize
- SQL.js / sql.js-as-sqlite3
- CORS
- Nodemon

## Repository Structure

```text
.
├── ecommerce-project/      # React + TypeScript frontend
├── ecommerce-backend/      # Express + Sequelize backend
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Install dependencies

Install dependencies for both applications:

```bash
cd ecommerce-project && npm install
cd ../ecommerce-backend && npm install
```

### 2. Start the backend

```bash
cd ecommerce-backend
npm run dev
```

By default, the API server runs on **port 3000**.

### 3. Start the frontend

In a separate terminal:

```bash
cd ecommerce-project
npm run dev
```

Open the local Vite URL shown in the terminal to use the storefront.

## Available Scripts

### Frontend (`ecommerce-project/`)
- `npm run dev` – start the Vite development server.
- `npm run build` – type-check and create a production build.
- `npm run lint` – run ESLint.
- `npm run preview` – preview the production build locally.

### Backend (`ecommerce-backend/`)
- `npm run dev` – start the backend with Nodemon.
- `npm run start` – run the backend with Node.js.
- `npm run zip` – create project zip artifacts.

## API Summary

The backend exposes routes under `/api`, including:

- `/api/products`
- `/api/delivery-options`
- `/api/cart-items`
- `/api/orders`
- `/api/payment-summary`
- `/api/reset`

For the complete endpoint reference, see:

- [`ecommerce-backend/documentation.md`](./ecommerce-backend/documentation.md)
- [`ecommerce-backend/troubleshooting.md`](./ecommerce-backend/troubleshooting.md)

## Development Notes

- The backend serves images from `ecommerce-backend/images/`.
- Default seed data lives in `ecommerce-backend/defaultData/`.
- If a frontend production build is copied into the backend `dist/` directory, the backend can serve the built app directly.

## Project Goals

This repository is well suited for:
- portfolio demonstrations,
- practicing full-stack React/Node development,
- experimenting with ecommerce UX patterns, and
- extending a small admin-enabled storefront application.

## License

This project is currently provided without an explicit license. Add one before distributing or using it commercially.
