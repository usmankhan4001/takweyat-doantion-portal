# Takweyat Donation Portal

A modern, mobile-first donation portal for **Takweyat Foundation** — a charitable organization enabling transparent, streamlined giving to verified causes.

![Takweyat](https://img.shields.io/badge/Takweyat-Donation%20Portal-teal?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)

---

## ✨ Features

- **5-Step Donation Flow** — Seamless, guided experience from cause selection to receipt download
- **Dynamic Cause Tiles** — Cards support full-bleed background images with gradient overlays
- **Consolidated Donor Form** — Name, Amount, and WhatsApp captured in a single screen
- **Multiple Payment Methods** — Bank Transfer (UBL) and Easypaisa/JazzCash with one-tap copy
- **Mandatory Receipt Upload** — Donors must attach a payment screenshot before proceeding
- **Instant Image Receipt** — A branded Takweyat receipt is generated and downloaded as a `.png` on completion
- **Admin Dashboard** — Password-protected `/admin-donation` route for managing donation causes
- **Mobile-First Design** — Glassmorphism UI, smooth animations, fully responsive

---

## 🛤️ Donation Flow

```
Step 1: Select a Cause       → beautiful cause cards with background images
Step 2: Donor Details        → Name, Amount (presets + custom), WhatsApp + country code
Step 3: Payment Instructions → Bank (UBL) or Easypaisa/JazzCash details with copy buttons
Step 4: Upload Receipt       → Mandatory screenshot upload (blocks progression if skipped)
Step 5: Thank You            → Personalized message + instant PNG receipt download
```

---

## 🛠️ Tech Stack

| Layer    | Technology              |
|----------|------------------------|
| Frontend | React 18 + Vite        |
| Styling  | Vanilla CSS (custom design system) |
| Backend  | Node.js + Express      |
| Database | `causes.json` (flat-file) |
| Receipt  | `html2canvas`          |
| Routing  | `react-router-dom` v6  |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/usmankhan4001/takweyat-doantion-portal.git
cd takweyat-doantion-portal

# Install dependencies
npm install
```

### Running Locally

Start both the frontend dev server and the backend API:

```bash
# Terminal 1 — Frontend (Vite dev server on port 5173)
npm run dev

# Terminal 2 — Backend API (Express server on port 3000)
node server.js
```

Then open **http://localhost:5173** in your browser.

---

## 🔧 Configuration

### Payment Details
Payment account details are hardcoded in `src/App.jsx` (Step 3). Update the following values as needed:

| Field          | Value                    |
|----------------|--------------------------|
| Account Title  | Muhammad Sohaib Ali      |
| Account Number | 0022259935014            |
| IBAN           | PK47UNIL0109000259935014 |
| Swift Code     | UNILPKKA                 |
| Easypaisa/JazzCash | +92 314 5217958      |

### Admin Dashboard
Access the admin panel at `/admin-donation`.

Default password is set in `server.js`:
```js
const ADMIN_PASSWORD = "takweyat_admin";
```
> ⚠️ Change this before deploying to production.

---

## 📁 Project Structure

```
donate.takweyat.org/
├── src/
│   ├── App.jsx          # Main wizard component (all 5 steps)
│   ├── index.css        # Design system & component styles
│   └── main.jsx         # React entry point
├── causes.json          # Donation causes database
├── server.js            # Express REST API
├── vite.config.js       # Vite configuration (proxies /api → port 3000)
└── index.html
```

---

## 🌐 Deployment

Build the production bundle:

```bash
npm run build
```

The output will be in the `dist/` folder. Serve it behind any static host (Nginx, Vercel, Netlify, etc.) alongside the Express backend.

---

## 📄 License

This project is proprietary to **Takweyat Foundation**. All rights reserved.
