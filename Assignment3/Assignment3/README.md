# User CRUD App

A simple Node.js + Express + MongoDB application with API endpoints and a UI for user registration, login, and data display.

## Features

- Register new users
- Login existing users
- Show all user records
- Edit and delete users from the UI

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file or use the default MongoDB URI:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/crud-node-express
PORT=3000
```

3. Start the server:

```bash
npm run dev
```

4. Open `http://localhost:3000` in your browser.

## API Endpoints

- `POST /user` - Create a new user
- `POST /user/login` - Login with email/password
- `GET /user` - Retrieve all users
- `GET /user/:id` - Retrieve a single user
- `PATCH /user/:id` - Update a user
- `DELETE /user/:id` - Delete a user
