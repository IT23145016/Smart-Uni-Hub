# Smart Campus Operations Hub

This repository contains a Smart Campus Operations Hub submission with a clearly identifiable Member 4 implementation slice for the IT3030 PAF assignment.

## Member Allocation

- Member 1: facilities catalogue and resource management
- Member 2: booking workflow and conflict checking
- Member 3: incident ticketing and technician updates
- Member 4: notifications, role management, and OAuth 2.0 integration improvements

## Member 4 Scope

Member 4 is responsible for three connected areas:

- Notification management for booking, role, and system updates
- Role-based access control for `ADMIN`, `USER`, and `TECHNICIAN`
- Google OAuth login with MongoDB-backed user persistence

## Member 4 Requirements Coverage

### Notifications

Implemented backend APIs:

- `GET /api/notifications`
- `GET /api/notifications/unread-count`
- `PATCH /api/notifications/{notificationId}/read`
- `PATCH /api/notifications/read-all`
- `POST /api/notifications` (`ADMIN`)
- `DELETE /api/notifications/{notificationId}`
- `POST /api/integrations/tickets/notify` (`ADMIN` or `TECHNICIAN`)

Implemented UI:

- Notification panel for signed-in users
- Unread count display
- Mark-one and mark-all as read actions
- Delete notification action
- Automatic booking submission, booking status, and role-change notifications
- Ticket-update notification integration endpoint for Member 3

### Role Management

Implemented backend APIs:

- `GET /api/admin/users`
- `POST /api/admin/users`
- `PUT /api/admin/users/{userId}/roles`
- `PATCH /api/admin/users/{userId}/status`
- `DELETE /api/admin/users/{userId}`

Implemented UI:

- Admin role management page
- Create user form
- Role assignment controls
- Activate/deactivate account control
- Delete user action

### OAuth Integration Improvements

Implemented features:

- Google OAuth sign-in through Spring Security OAuth2 Client
- OAuth user creation and update in MongoDB
- Preserved role assignments across repeated logins
- Logout redirect support
- Inactive accounts are blocked from logging in
- Bootstrap support for Member 4 test accounts

Bootstrap emails used for Member 4 testing:

- Admin: `mklskodithuwakku@gmail.com`
- User: `kmls19kodituwakku@gmail.com`

## Security

- Role-based authorization using Spring Security
- Admin-only user management endpoints
- Validated request DTOs
- Protected authenticated endpoints
- User-owned notification modifications only

## Tech Stack

- Backend: Spring Boot, Spring Security, Spring Data MongoDB, OAuth2 Client, Maven
- Frontend: React, React Router, Vite
- Database: MongoDB

## Local Setup

1. Create `backend/.env` from `backend/.env.example`.
2. Create `frontend/.env` from `frontend/.env.example` if needed.
3. Set MongoDB and Google OAuth credentials in `backend/.env`.
4. Start the backend on port `8081`.
5. Start the frontend on port `5174`.

Backend run:

```powershell
cd backend
$env:JAVA_HOME="C:\Program Files\Java\latest\jdk-21"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
.\apache-maven-3.9.9\bin\mvn.cmd spring-boot:run
```

Frontend run:

```powershell
cd frontend
npm install
npm run dev
```

## Integration Notes

- Booking approval, rejection, and cancellation events create notifications automatically.
- Booking creation now creates a pending-review notification automatically.
- Role changes create user-facing notifications for auditability.
- Member 3 ticket workflows can integrate by calling `/api/integrations/tickets/notify`.
- OAuth login creates or updates a MongoDB user record and keeps previously assigned roles.
