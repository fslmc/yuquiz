-- CreateTable
CREATE TABLE "public"."USERS" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashed_pw" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "USERS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QUIZZES" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "author_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QUIZZES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QUESTION_TYPES" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "QUESTION_TYPES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QUESTIONS" (
    "id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "question_type_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "points" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "QUESTIONS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ANSWER_OPTIONS" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "option_text" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ANSWER_OPTIONS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SESSIONS" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SESSIONS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QUIZ_ATTEMPTS" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "score" DOUBLE PRECISION,

    CONSTRAINT "QUIZ_ATTEMPTS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QUESTION_RESPONSES" (
    "id" TEXT NOT NULL,
    "attempt_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "selected_option_id" TEXT,
    "text_answer" TEXT,
    "is_correct" BOOLEAN,
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QUESTION_RESPONSES_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USERS_email_key" ON "public"."USERS"("email");

-- CreateIndex
CREATE UNIQUE INDEX "QUESTION_TYPES_code_key" ON "public"."QUESTION_TYPES"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SESSIONS_session_token_key" ON "public"."SESSIONS"("session_token");

-- AddForeignKey
ALTER TABLE "public"."QUIZZES" ADD CONSTRAINT "QUIZZES_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."USERS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QUESTIONS" ADD CONSTRAINT "QUESTIONS_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "public"."QUIZZES"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QUESTIONS" ADD CONSTRAINT "QUESTIONS_question_type_id_fkey" FOREIGN KEY ("question_type_id") REFERENCES "public"."QUESTION_TYPES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ANSWER_OPTIONS" ADD CONSTRAINT "ANSWER_OPTIONS_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."QUESTIONS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SESSIONS" ADD CONSTRAINT "SESSIONS_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."USERS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QUIZ_ATTEMPTS" ADD CONSTRAINT "QUIZ_ATTEMPTS_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."USERS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QUIZ_ATTEMPTS" ADD CONSTRAINT "QUIZ_ATTEMPTS_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "public"."QUIZZES"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QUIZ_ATTEMPTS" ADD CONSTRAINT "QUIZ_ATTEMPTS_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."SESSIONS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QUESTION_RESPONSES" ADD CONSTRAINT "QUESTION_RESPONSES_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "public"."QUIZ_ATTEMPTS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QUESTION_RESPONSES" ADD CONSTRAINT "QUESTION_RESPONSES_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."QUESTIONS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QUESTION_RESPONSES" ADD CONSTRAINT "QUESTION_RESPONSES_selected_option_id_fkey" FOREIGN KEY ("selected_option_id") REFERENCES "public"."ANSWER_OPTIONS"("id") ON DELETE SET NULL ON UPDATE CASCADE;
