# Basic Auth with Firebase

A Next.js 16 application with Firebase Authentication, featuring login/registration forms with server actions and route protection.

## Features

- ✅ User registration with email/password
- ✅ User login with email/password
- ✅ Form validation using `useActionState` and `formAction`
- ✅ Server actions for Firebase Auth integration
- ✅ Protected routes using Next.js proxy
- ✅ Session management with HTTP-only cookies
- ✅ Dashboard page requiring authentication

## Setup

### 1. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication:

   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider

3. Get your Firebase credentials:

   **For Firebase Admin SDK:**

   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Extract these values:
     - `project_id` → `FIREBASE_PROJECT_ID`
     - `client_email` → `FIREBASE_CLIENT_EMAIL`
     - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the `\n` characters)

   **For Firebase Web API:**

   - Go to Project Settings > General
   - Copy the "Web API Key" → `NEXT_PUBLIC_FIREBASE_API_KEY`

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Routes

- `/` - Home page (public)
- `/login` - Login page (public, redirects to dashboard if authenticated)
- `/register` - Registration page (public, redirects to dashboard if authenticated)
- `/dashboard` - Protected dashboard page (requires authentication)

## Project Structure

```
app/
  actions/
    auth.ts          # Server actions for login/register/logout
  dashboard/
    page.tsx         # Protected dashboard page
  login/
    page.tsx         # Login page
  register/
    page.tsx         # Registration page
components/
  login-form.tsx     # Login form with useActionState
  register-form.tsx  # Registration form with useActionState
lib/
  firebase.ts        # Firebase Admin SDK configuration
proxy.ts        # Route protection middleware
```

## Authentication Flow

1. User submits login/registration form
2. Server action validates input and calls Firebase Auth REST API
3. On success, ID token is stored in HTTP-only cookie
4. Middleware verifies token on protected routes
5. Invalid/expired tokens redirect to login

## Security Features

- HTTP-only cookies prevent XSS attacks
- Server-side token verification
- Middleware protects all routes except public ones
- Form validation on both client and server
