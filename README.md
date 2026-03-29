# Smart Campus Operations Hub

This workspace contains the Member 4 implementation slice for the group assignment:

- Notifications module
- Role management
- OAuth 2.0 integration improvements

## Structure

- `backend/`: Spring Boot REST API with MongoDB, validation, exception handling, role-based authorization, and Google OAuth login wiring.
- `frontend/`: React + Vite client with a notifications panel and admin role management UI.

## Backend endpoints

- `GET /api/health`
- `GET /api/auth/me`
- `GET /api/notifications`
- `GET /api/notifications/unread-count`
- `PATCH /api/notifications/{notificationId}/read`
- `PATCH /api/notifications/read-all`
- `POST /api/notifications` (`ADMIN`)
- `GET /api/admin/users` (`ADMIN`)
- `PUT /api/admin/users/{userId}/roles` (`ADMIN`)

## Local setup

1. Backend config lives in `backend/.env`.
2. Frontend config lives in `frontend/.env`.
3. Add Google OAuth credentials before testing Google sign-in.
4. Start the backend on port `8081`.
5. Start the frontend on port `5174`.

## Notes for team integration

- Booking and ticket modules can publish notification events by calling the notification service or `POST /api/notifications`.
- Role changes automatically create a user-facing notification for auditability.
- OAuth login creates or updates a MongoDB user record and preserves assigned roles across sign-ins.
