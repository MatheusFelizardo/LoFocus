# LoFocus

LoFocus is a minimalist productivity web app built with **Next.js**, **Prisma**, and **Auth.js**.  
It helps you stay focused with customizable **Pomodoro timers**, session **tags**, and **lofi background music**.

---

## ✨ Features

- 🔔 Configurable Pomodoro timer (focus, short break, long break)
- 🏷️ Tag sessions (e.g., _Work_, _Study_, _Reading_)
- 🎵 Lofi background music player (YouTube)
- 🔐 Social login with Google and GitHub
- 📊 Session tracking via Postgres with Prisma ORM
- 🎨 UI built with **Material UI** + **TailwindCSS**

---

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Prisma ORM](https://www.prisma.io/)
- [Auth.js (NextAuth v5)](https://authjs.dev/)
- [Postgres](https://www.postgresql.org/)
- [Material UI](https://mui.com/)
- [TailwindCSS](https://tailwindcss.com/)

---

## ⚙️ Setup & Installation

### 1. Clone the repo

```bash
git clone https://github.com/your-username/lofocus.git
cd lofocus
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# Postgres connection
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require

# Auth.js
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

⚠️ **Important**

- Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE` with your Postgres credentials.
- Generate `NEXTAUTH_SECRET` with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- On Google Cloud Console and GitHub Developer Settings, set the **OAuth redirect URIs** to:
  ```
  http://localhost:3000/api/auth/callback/google
  http://localhost:3000/api/auth/callback/github
  ```

### 4. Run Prisma migrations

```bash
npx prisma migrate dev --name init_auth
```

### 5. Generate Prisma client

```bash
npx prisma generate
```

### 6. Start the development server

```bash
npm run dev
```

## 📂 Project Structure

This project follows the next pages structure

```
lofocus/
├── prisma/
│   └── schema.prisma
├── app/
│   ├── api/
│   │   └── auth/[...nextauth]/route.ts   # Auth.js config
│   ├── auth                    # Auth pages
│   └── other-pages
├── package.json
└── .env
```

---

## 📜 License

MIT License © 2025 Matheus Felizardo

