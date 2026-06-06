import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Server-side answer keys for the 4 modules
const QUIZ_ANSWERS: Record<number, number[]> = {
  0: [1, 2], // Module 1: Q1: Option index 1, Q2: Option index 2
  1: [0, 1], // Module 2: Q1: Option index 0, Q2: Option index 1
  2: [2, 0], // Module 3: Q1: Option index 2, Q2: Option index 0
  3: [1, 2]  // Module 4: Q1: Option index 1, Q2: Option index 2
};

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { moduleIndex, answers } = await req.json();

    if (typeof moduleIndex !== "number" || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const correctAnswers = QUIZ_ANSWERS[moduleIndex];
    if (!correctAnswers) {
      return NextResponse.json({ error: "Invalid module index" }, { status: 400 });
    }

    // Calculate score
    let correctCount = 0;
    correctAnswers.forEach((correctIdx, qIdx) => {
      if (answers[qIdx] === correctIdx) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / correctAnswers.length) * 100);
    const isPassed = scorePercent >= 100; // Require 100% to pass this modular check

    // Save or update progress
    const progress = await prisma.trainingProgress.upsert({
      where: {
        userId_moduleIndex: {
          userId: user.id,
          moduleIndex,
        },
      },
      update: {
        isCompleted: isPassed,
        quizScore: scorePercent,
        completedAt: isPassed ? new Date() : null,
      },
      create: {
        userId: user.id,
        moduleIndex,
        isCompleted: isPassed,
        quizScore: scorePercent,
        completedAt: isPassed ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      score: scorePercent,
      isPassed,
      progress,
    });
  } catch (error: any) {
    console.error("Failed to complete module:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
