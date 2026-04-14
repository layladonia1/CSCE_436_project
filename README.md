# StudySpot

StudySpot is a React + Vite web app that helps students choose study tasks, find study spots, run focus sessions, sign in with Google, and optionally view a weekly Google Calendar preview.

## Run locally

1. Clone the repo.
2. Checkout the branch you want to test.
3. Install dependencies:

```bash
npm install
```

4. Create a local `.env` file in the project root.
5. Add the Google client ID:

```env
VITE_GOOGLE_CLIENT_ID=708404487598-52tli9s2btmtlta8a5fdkctusfmj92vb.apps.googleusercontent.com
```

6. Start the app:

```bash
npm run dev
```

7. Open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

## Common issues

### I can see the code changes, but not the login feature in the app

This usually means `.env` is missing. The app needs:

```env
VITE_GOOGLE_CLIENT_ID=...
```

The `.env` file is not committed to git, so everybody must create it locally.

### Google says "Access blocked" or the app is not verified

This usually means your Google account has not been enabled for testing on the shared OAuth app yet. If that happens, contact the teammate (Nethra) managing the Google Cloud setup.

### Google Calendar says it cannot load events

First confirm your local `.env` file exists and uses the same shared client ID shown above. If login works but Calendar does not, contact the teammate managing the shared Google setup.

## Available scripts

```bash
npm run dev
npm run build
npm run preview
```

## Notes

- `.env` is local only and should not be committed.
- The app currently uses Google Sign-In for authentication and Google Calendar read-only access for the weekly calendar card.
