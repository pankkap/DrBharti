# 🩺 Doctor Clinic & AI Appointment Booking Web Application
### Powered by React, Vite, Material UI & Evolution Go WhatsApp Automation

A modern, full-featured Doctor Clinic Web Application featuring an interactive **AI Chatbot Booking Assistant**, comprehensive **Doctor Administration Portal**, and real-time **WhatsApp Automated Notifications** powered by [Evolution Go](https://github.com/evolution-foundation/evolution-go).

---

## 🌟 Key Features

- 🤖 **Interactive AI Booking Assistant**: Auto-opens for visitors with conversational step-by-step appointment scheduling.
- 📱 **Automated WhatsApp Notifications (Evolution Go)**:
  - **Instant Patient Booking Receipts**
  - **Real-Time Doctor Alerts**
  - **Status Update Messages** (Approved, Rescheduled, Completed, Cancelled)
- 👨‍⚕️ **Doctor Administration Portal (`/admin`)**:
  - Manage & approve appointments in 1 click with non-intrusive toast feedback
  - Reschedule with live date & time selection
  - Export appointments to Excel
  - Customizable profile, clinic fees, services, patient testimonials, FAQs & gallery
  - Client-friendly WhatsApp Notification Center (technical details hidden)
- 🌐 **Clean Production Architecture**: Fully decoupled frontend (Netlify/Vercel) and multi-tenant WhatsApp Gateway.

---

## 🚀 Quick Start (Local Development)

### 1. Start Evolution Go WhatsApp Gateway
```bash
cd evolution-go
docker compose up -d
```
Access manager at: **`http://localhost:8080/manager/login`**  
Master Key: `ev_sec_993418af882190c102`

### 2. Start Frontend App
```bash
npm install
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

---

## 📖 Complete Documentation

For step-by-step local setup, Cloud VPS deployment (Ubuntu + Docker + Nginx + SSL), multi-doctor client onboarding, and Netlify/Vercel production configuration, see:

👉 **[Evolution Go Setup & Production Guide (docs/EVOLUTION_GO_SETUP_GUIDE.md)](docs/EVOLUTION_GO_SETUP_GUIDE.md)**
