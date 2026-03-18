
# Wildora Backend (Minimal)

A minimal Node.js + Express backend scaffold for the Wildora React Native app.

This repo includes:

- Authentication bridge using Firebase Authentication + server-issued JWTs
- Photo upload endpoint (local disk storage)
- Post creation and feed retrieval (file-backed JSON store)
- Destinations data and a small recommendation stub
- AI analysis endpoint (stub for image/text analysis)

**When to use**

This is a starter backend intended for local development and prototyping. For production use you should replace file-backed storage with a database (Postgres, MongoDB, etc.), move uploads to cloud storage (S3/GCS), and connect a real AI provider.

**Repo layout**

- `src/` — application source
	- `index.js` — server entrypoint and route wiring
	- `routes/` — Express route handlers (`auth`, `photos`, `posts`, `destinations`, `recommendations`, `ai`)
	- `middleware/` — auth middleware (Firebase + JWT)
	- `config/` — Firebase initialization
	- `services/` — small helpers (JSON storage)
- `data/` — sample JSON data (destinations, posts)
- `uploads/` — runtime uploads (ignored in git)
- `.env.example` — example environment variables

Architecture (high level)

- Clients (React Native) authenticate with Firebase Authentication.
- Client sends Firebase ID token to `/auth/session` to exchange for a server JWT.
- Server JWT protects endpoints like photo upload, create-post, and AI analysis.
- Uploaded photos are saved to local `uploads/` and served statically from `/uploads`.
- Posts are appended to `data/posts.json` (simple file-based store).

Environment variables

Copy `.env.example` to `.env` and edit values:

- `PORT` — server port (default 4000)
- `JWT_SECRET` — secret for signing server JWTs (use a secure random string)
- `FIREBASE_SERVICE_ACCOUNT_PATH` — path to Firebase service account JSON (optional for dev)
- `UPLOAD_DIR` — directory for storing uploaded files (defaults to `./uploads`)

Firebase setup

1. Create a Firebase project and enable Email/Password or social providers as needed.
2. Generate a service account JSON from the Firebase console and place it at the path referenced by `FIREBASE_SERVICE_ACCOUNT_PATH` (or `serviceAccountKey.json` in repo root for local dev).
3. For RN clients use the Firebase client SDK to sign-in; send the client ID token to `/auth/session`.

Running locally

Install dependencies and start in dev mode:

```bash
npm install
npm run dev
```

Server will start on `http://localhost:4000` by default.

Example requests

- Exchange Firebase ID token for server JWT:

```bash
curl -X POST http://localhost:4000/auth/session \
	-H "Content-Type: application/json" \
	-d '{"idToken":"<FIREBASE_ID_TOKEN>"}'
```

- Upload a photo (multipart, requires `Authorization: Bearer <JWT>`):

```bash
curl -X POST http://localhost:4000/upload-photo \
	-H "Authorization: Bearer <JWT>" \
	-F "photo=@./myphoto.jpg"
```

- Create a post:

```bash
curl -X POST http://localhost:4000/create-post \
	-H "Authorization: Bearer <JWT>" \
	-H "Content-Type: application/json" \
	-d '{"content":"Hello from RN","imageUrl":"/uploads/123.jpg"}'
```

- Get feed:

```bash
curl http://localhost:4000/feed
```

Endpoints summary

- `POST /auth/session` — exchange Firebase ID token for server JWT. Accepts JSON `{ idToken }` or header `x-firebase-token`.
- `POST /auth/signup` — create user via Firebase admin (email/password).
- `POST /upload-photo` — protected; multipart `photo`.
- `POST /create-post` — protected; `{ content, imageUrl }`.
- `GET /feed` — public; paginated feed (query `?page=&limit=`).
- `GET /destinations` — list sample destinations.
- `GET /recommendations` — simple recommendations; filter by `?tag=`.
- `POST /ai/analyze` — protected; accepts `{ imageUrl, text }` and returns a stub analysis.

Testing and development notes

- The project is intentionally simple to make local iteration quick. Replace file storage with a real DB and uploads with cloud storage before production.
- If Firebase service account is not provided, Firebase-dependent endpoints will return errors — the server still runs for non-Firebase flows.

Deployment guidance

- Add a secure `JWT_SECRET` in your environment.
- Use a managed database (RDS, Cloud SQL, Mongo Atlas) and update `services/storage.js` to read/write there.
- Store uploaded assets in S3 or GCS and serve from CDN.

Next steps you might want me to implement

- Wire a real DB (Postgres/Mongo) and update posts storage.
- Replace AI stub with an integration (OpenAI, Azure, or custom vision model).
- Add end-to-end tests and CI config.
- Add Dockerfile and Kubernetes/Heroku deployment manifests.

If you want, I can run the server now in the workspace and show the startup log, or implement one of the next steps above.

# wildora-Back-end