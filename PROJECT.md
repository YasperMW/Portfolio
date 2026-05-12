# PaLevel - Hostel Booking Platform

## Description

PaLevel is a full-stack hostel booking platform connecting students with accommodation providers. It consists of three interconnected applications sharing the same API:

- **Web App** (Laravel)
- **Mobile App** (Flutter for iOS & Android)
- **Backend API** (FastAPI)

All three share identical functionality through a unified REST API and WebSocket for real-time features.

## Features

- **Multi-Role System**: Students, Landlords, and Administrators with role-based access
- **Authentication**: Email/password, Google OAuth, and OTP verification
- **Hostel & Room Management**: Complete CRUD with media uploads, location picker
- **Booking System**: Room reservation, extensions, and cancellations
- **Payment Integration**: PayChangu for payment processing and verification
- **Real-time Messaging**: WebSocket-based chat between students and landlords
- **Push Notifications**: Firebase Cloud Messaging for cross-platform notifications
- **PDF Generation**: Booking receipts, confirmations, and reports
- **Location Services**: Distance calculations, routing (OSRM), map display
- **Admin Dashboard**: Statistics, user management, content moderation

---

## Tech Stack

### Backend API (FastAPI - Python)

| Component | Technology |
|-----------|------------|
| Framework | FastAPI (Python 3.10+) |
| Database | SQLite / PostgreSQL |
| ORM | SQLAlchemy 2.0 |
| Auth | JWT (python-jose) |
| Payments | PayChangu API |
| WebSocket | FastAPI WebSocket |
| Email | SMTP / Console |
| Docs | Swagger UI (OpenAPI) |

Key packages: `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`, `python-jose`, `passlib`, `fpdf`

### Web Application (Laravel)

| Component | Technology |
|-----------|------------|
| Framework | Laravel 12 (PHP 8.2+) |
| Database | SQLite (dev) / MySQL (prod) |
| Auth | Laravel Auth + Socialite |
| Payments | PayChangu API via FastAPI |
| Real-time | FastAPI WebSocket |
| Frontend | Blade Templates + Vite |

### Mobile Application (Flutter)

| Component | Technology |
|-----------|------------|
| Framework | Flutter 3.x / Dart |
| State Management | Provider / Riverpod |
| HTTP Client | Dio |
| Push Notifications | Firebase Cloud Messaging |
| Real-time | Socket.IO / WebSocket |
| Maps | Flutter Map + OpenStreetMap |
| PDF | pdf package |

### Shared Services

| Service | Implementation |
|---------|----------------|
| API Server | FastAPI (REST + WebSocket) |
| Auth | JWT tokens |
| Database | SQLite (can upgrade to PostgreSQL) |
| File Storage | Local filesystem / Cloud |
| Notifications | Firebase FCM |

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Laravel Web   │────▶│   FastAPI API   │◀────│  Flutter App    │
│                 │     │                 │     │  (iOS/Android)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │   Database     │
                        │   (SQLite/PG)  │
                        └─────────────────┘
```

---

## API Endpoints (FastAPI)

### Authentication
- `POST /auth/login` - Email/password login
- `POST /auth/register/{user_type}` - User registration
- `POST /auth/google` - Google OAuth
- `POST /auth/verify-otp` - OTP verification
- `POST /auth/resend-otp` - Resend OTP

### Users
- `GET /users/me` - Get current user
- `PUT /users/profile` - Update profile
- `POST /users/avatar` - Upload avatar
- `DELETE /users/account` - Delete account

### Hostels
- `GET /hostels` - List hostels (with filters)
- `POST /hostels` - Create hostel (landlord)
- `GET /hostels/{id}` - Get hostel details
- `PUT /hostels/{id}` - Update hostel
- `DELETE /hostels/{id}` - Delete hostel

### Rooms
- `GET /rooms` - List rooms
- `POST /rooms` - Create room
- `GET /rooms/{id}` - Get room details
- `PUT /rooms/{id}` - Update room
- `DELETE /rooms/{id}` - Delete room

### Bookings
- `POST /bookings` - Create booking
- `GET /bookings` - List user bookings
- `GET /bookings/{id}` - Get booking details
- `POST /bookings/{id}/extend` - Extend booking
- `POST /bookings/{id}/cancel` - Cancel booking

### Payments
- `POST /payments/initiate` - Initiate payment
- `POST /payments/verify` - Verify payment
- `GET /payments/history` - Payment history

### Messages
- `WebSocket /ws/messages` - Real-time messaging
- `GET /messages/{conversation_id}` - Get messages

### Notifications
- `GET /notifications` - List notifications
- `PUT /notifications/{id}/read` - Mark as read
- `POST /notifications/register-device` - Register device for FCM

### Admin
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/users` - User management
- `GET /admin/hostels` - Hostel moderation
- `PUT /admin/users/{id}/ban` - Ban user

---

## Database Schema (Key Tables)

### Users
- id, email, password_hash, name, role, phone, university, avatar_url, google_id, created_at

### Hostels
- id, landlord_id, name, description, address, latitude, longitude, university, amenities, images, status

### Rooms
- id, hostel_id, name, type, price, capacity, availability, features, images

### Bookings
- id, user_id, room_id, start_date, end_date, status, payment_status, total_amount

### Payments
- id, booking_id, amount, reference, status, method, verified_at

### Messages
- id, sender_id, receiver_id, content, read_at, created_at

### Notifications
- id, user_id, title, body, data, read, created_at