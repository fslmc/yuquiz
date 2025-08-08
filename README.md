# yuQuiz

**yuQuiz** is a modern, full-stack quiz platform inspired by Quizizz, built with Next.js (App Router), React, Prisma, and PostgreSQL. Challenge your friends, test your knowledge, and climb the leaderboard on the ultimate quiz game platform!

---

## Features

- **User Authentication**: Register and log in securely (with hashed passwords).
- **Quiz Creation**: Authenticated users can create, edit, and delete their own quizzes.
- **Question & Answer Management**: Add multiple questions and answer options per quiz, with support for marking correct answers.
- **Quiz Gameplay**: Users can play quizzes, answer questions, and receive instant feedback.
- **Result Page**: After finishing a quiz, users see their score and a breakdown of correct/wrong answers.
- **Attempt Tracking**: All quiz attempts are tracked, including score and completion time.
- **Protected Routes**: Pages like `/profile` and `/quizzes/new` are accessible only to logged-in users.

---

## Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Custom (with bcrypt), session-based
- **Deployment**: Vercel

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/yuquiz.git
cd yuquiz
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and set the following variables:
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret
```

> Make sure to set these variables in your Vercel dashboard for production!

### 4. Set Up the Database

Run Prisma migrations to set up your database schema:

```bash
npx prisma migrate deploy
```
or for development
```bash
npx prisma migrate dev
```

(Optional) Seed the database if you have seed scripts.

### 5. Run the Development Server

```bash
pnpm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## Project Structure
```
src/
 ├── app/
 │   ├── api/
 │   │   ├── auth/
 │   │   ├── quizzes/
 │   │   ├── attempts/
 │   │   └── questions/
 │   ├── hooks/
 │   ├── ui/
 │   ├── globals.css
 │   ├── layout.js
 │   ├── page.js
 │   ├── play/[quizId]/
 │   ├── result/[attemptId]/
 │   └── profile/
 └── prisma/
     └── schema.prisma
```
---

## API Overview

### Authentication

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/[...nextauth]` — Login (NextAuth.js or custom)
- `GET /api/auth/session` — Get current session info

### Quizzes

- `GET /api/quizzes` — List all quizzes
- `POST /api/quizzes` — Create a new quiz
- `GET /api/quizzes/my` — List quizzes created by the logged-in user
- `GET /api/quizzes/[quizId]` — Get quiz details (optionally with questions)
- `PUT /api/quizzes/[quizId]` — Update quiz (owner only)
- `DELETE /api/quizzes/[quizId]` — Delete quiz (owner only)

### Questions & Options

- `GET /api/quizzes/[quizId]/questions` — List questions for a quiz
- `POST /api/quizzes/[quizId]/questions` — Add a question to a quiz
- `PUT /api/quizzes/[quizId]/questions/[questionId]` — Update a question and its options
- `DELETE /api/questions/[questionId]` — Delete a question

### Gameplay

- `POST /api/quizzes/[quizId]/attempts` — Start a new quiz attempt
- `GET /api/attempts/[attemptId]/next-question` — Get the next unanswered question
- `POST /api/attempts/[attemptId]/responses` — Submit an answer
- `GET /api/attempts/[attemptId]/progress` — Get attempt progress
- `GET /api/attempts/[attemptId]/result` — Get attempt result (score, answers)

---

## Middleware & Route Protection

- `/profile`, `/quizzes/new`, and `/play` routes are protected by [middleware.js](file:///E:/SMK/JabarDigitalAcademy/next/yuquiz/src/middleware.js).  
  Users must be logged in to access these pages.

---

## Customization

- **Styling:** Uses Tailwind CSS with a custom dark palette ([globals.css](file:///E:/SMK/JabarDigitalAcademy/next/yuquiz/src/app/globals.css)).
- **Fonts:** Uses [Poppins](https://fonts.google.com/specimen/Poppins) via Next.js font optimization.
- **Analytics:** Integrated with Vercel Analytics.

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

MIT

---

## Credits

- Built by fslmc
- Inspired by Quizizz, Kahoot, and other quiz platforms
- [beliau](https://www.youtube.com/@ren_kisaragi__)

---

## Screenshots


---

## Contact

For questions or support, open an issue or contact [fslfaisal17@gmail.com](mailto:fslfaisal17@gmail.com).

