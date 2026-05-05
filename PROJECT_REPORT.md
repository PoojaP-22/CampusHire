# Campus Hire Project Report

## Executive Summary

Campus Hire is a MERN-based placement and career tracking portal for students, TPOs, companies, and admins. The backend foundation is implemented and documented, while the frontend has the core structure and auth flow wired up. The main functional blocker observed during local testing is that the frontend is trying to call the API at `http://localhost:5000/api` when the backend is not running, which causes registration to fail with `ERR_CONNECTION_REFUSED`.

## Project Scope

The project is intended to support:

- Student account registration, login, and profile tracking
- TPO drive management and application review
- Company onboarding and hiring workflows
- Admin oversight and reporting

## Current Architecture

The application is split into three main layers:

- Frontend: React + Vite
- Backend: Express + Node.js
- Database: MongoDB / MongoDB Atlas

The deployment guide also targets Vercel for the frontend and Render for the backend.

## Implemented Backend Capabilities

The backend is the most complete part of the system. It includes:

- Authentication endpoints for register, login, logout, profile retrieval, profile update, and password update
- JWT-based auth with HTTP-only cookies
- Role-based support for `student`, `tpo`, `company`, and `admin`
- Mongoose models for users, student profiles, companies, drives, and applications
- Validation middleware for registration, login, and profile updates
- Centralized error handling, rate limiting, CORS, Helmet, compression, and cookie parsing

## Frontend Status

The frontend has a substantial scaffold in place:

- Auth pages for login and registration
- Redux auth slice and API service layer
- Shared layout and common UI components
- Page folders for admin, company, student, and TPO dashboards

The registration UI submits data correctly in structure, but the request fails if the backend is not running or the API base URL is still pointed at localhost.

## Current Working Flow

For local development, the expected flow is:

1. Start MongoDB locally or use Atlas.
2. Start the backend from the `server` folder.
3. Start the frontend from the project root.
4. Ensure the frontend API base URL points to the running backend.

When those conditions are met, registration should reach `POST /api/auth/register` successfully.

## Known Blockers and Risks

The main issue currently observed is:

- `http://localhost:5000/api/auth/register` is unreachable when the backend is not running, so account creation fails with a connection refused error.

Additional configuration risks:

- `VITE_API_URL` must point to the active backend URL for the frontend.
- `FRONTEND_URL` must match the deployed frontend origin for CORS on the backend.
- Backend startup depends on valid environment variables, especially `MONGODB_URI` and `JWT_SECRET`.

## Status by Area

- Backend auth: implemented
- Backend models: implemented
- Backend security middleware: implemented
- Frontend auth UI: implemented
- Frontend API wiring: implemented, but depends on correct environment configuration
- Deployment documentation: implemented
- Full placement workflow beyond auth: partially implemented or pending

## Recommended Next Steps

1. Verify the backend starts cleanly in `d:\Campus-hire\server`.
2. Confirm `MONGODB_URI` and `JWT_SECRET` in `server/.env`.
3. Confirm the frontend is using the correct API base URL in `src/services/api.js` or the `VITE_API_URL` environment variable.
4. Continue implementing the drive and application workflow APIs.
5. Add a small registration smoke test once the backend is running reliably.

## Key References

- [README.md](README.md)
- [PROJECT_STATUS.md](PROJECT_STATUS.md)
- [COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md)
- [QUICK_START.md](QUICK_START.md)
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
