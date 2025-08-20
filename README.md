## ChatStop

A full‑stack real‑time chat application with authentication, admin dashboard, audit logging, and REST APIs. Built with Node.js/Express, MongoDB, React, and Socket.IO.

### Features
- **Authentication**: signup, login, email verification, logout, refresh tokens, password reset
- **Real‑time chat**: Socket.IO for live messaging
- **Admin**: list users, update roles, suspend/reactivate, audit logs, summary metrics
- **Audit logging**: automatic logging of admin actions
- **Validation**: Joi schemas with reusable middlewares
- **Testing**: Jest tests for backend controllers

---

## Tech Stack
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.IO, Joi, Nodemailer
- **Frontend**: React (CRA), Redux Toolkit, React Router, TailwindCSS

---

## Monorepo Layout
```
ChatStop/
  backend/
    src/
      app.js
      db/
      routes/
      controllers/
      services/
      model/
      utils/
      validations/
      socket/
    index.js
    package.json
  frontend/
    src/
    public/
    package.json
```

---

## Prerequisites
- Node.js 18+
- MongoDB instance (local or cloud)

---

## Environment Variables
Create a `.env` file in `backend/`:

```bash
# Server
PORT=4000
PUBLIC_DIR=public
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/chatstop

# Auth & Tokens
ACCESS_TOKEN_SECRET=replace-with-strong-secret
REFRESH_TOKEN_SECRET=replace-with-strong-secret
JWT_SECRET=replace-with-strong-secret            # used for email verification
RESET_TOKEN_SECRET=replace-with-strong-secret    # used for password reset
ADMIN_EMAIL=admin@example.com

# Email (Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-or-smtp-pass

# Cloudinary 
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

Notes:
- Update CORS origins in `backend/src/app.js` if your client URL differs.
- Cloudinary credentials are currently hard‑coded in `backend/src/config/cloudinary.js`. For security, migrate them to the env vars above.

---

## Install & Run

### Backend
```bash
cd backend
npm install
npm run dev   # starts with nodemon on PORT (default 4000)
# or
npm start     # plain node
```
The API base path is `http://localhost:4000/main` by default.

### Frontend
```bash
cd frontend
npm install
npm start     # starts CRA on http://localhost:3000
```

---

## API Overview (selected)
Base path: `/main`

### Auth
- `POST /login` — email, password
- `POST /signup` — username, email, password
- `GET  /verify-email/:token`
- `POST /logout` — requires auth
- `POST /reset-password` — email
- `POST /update-password/:resetToken` — password
- `POST /verify` — quick auth check

### Admin (requires `jwtVerify` + `adminChecker`)
- `GET  /admin/users` — list users (filters + pagination)
- `PATCH /admin/users/:id/role` — body: `{ role }`
- `PATCH /admin/users/:id/suspend` — body: `{ reason }`
- `PATCH /admin/users/:id/reactivate`
- `GET  /admin/reports/summary`
- `GET  /admin/audit-logs` — filters + pagination

Other modules include message, user, and request routes under `/main/*`.

---

## Validation
- Located in `backend/src/validations/`:
  - `authValidations.js` — login, signup, tokens, password reset
  - `adminValidations.js` — list users, role changes, suspend/reactivate, audit logs
- Route middleware integrates Joi schemas to validate `body`, `query`, and `params`.

---

## Real‑Time (Socket.IO)
- Socket server initialized in `backend/src/socket/socket.js`
- CORS origin defaults to `http://localhost:3000`
- Clients should emit `join` with a username to register their socket id

---

## Testing (Backend)
```bash
cd backend
npm test
```
- Uses Jest; controller tests are under `backend/tests/controllers/`

---

## Development Notes
- DB name constant is defined in `backend/src/constants.js`
- Ensure cookies work over HTTPS in production (httpOnly, secure flags are enabled)
- Update CORS origins and cookie settings per environment

---

## Scripts Reference
### Backend `package.json`
- `npm run dev` — nodemon server with dotenv
- `npm start` — node server
- `npm test` — run Jest tests

### Frontend `package.json`
- `npm start` — CRA dev server
- `npm run build` — production build
- `npm test` — CRA tests

---

## Security Checklist
- Set strong secrets for all JWT/token env vars
- Use app passwords or SMTP creds for Gmail/Nodemailer
- Move Cloudinary credentials to env (avoid hard‑coding)
- Configure allowed CORS origins explicitly for prod
- Serve over HTTPS in production

---

## License
ISC
