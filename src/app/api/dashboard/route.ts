import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import Task from "@/lib/models/Task";
import DsaProblem from "@/lib/models/DsaProblem";
import Revision from "@/lib/models/Revision";
import Goal from "@/lib/models/Goal";
import StudySession from "@/lib/models/StudySession";
import JobApplication from "@/lib/models/JobApplication";
import LearningTopic from "@/lib/models/LearningTopic";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedUser(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const userId = session.userId;
    const todayStr = new Date().toISOString().split("T")[0];

    // 1. Tasks Today
    const todayTasks = await Task.find({ userId, scheduledDate: todayStr }).sort({ priority: -1 });
    const completedTasksToday = todayTasks.filter((t) => t.status === "COMPLETED").length;

    // 2. DSA Problems
    const totalDsaProblems = await DsaProblem.countDocuments({ userId });
    const solvedIndependently = await DsaProblem.countDocuments({
      userId,
      status: "SOLVED_INDEPENDENTLY",
    });
    const solvedWithHints = await DsaProblem.countDocuments({
      userId,
      status: "SOLVED_WITH_HINTS",
    });
    const solutionViewed = await DsaProblem.countDocuments({
      userId,
      status: "SOLUTION_VIEWED",
    });

    const easySolved = await DsaProblem.countDocuments({
      userId,
      difficulty: "EASY",
      status: { $in: ["SOLVED_INDEPENDENTLY", "SOLVED_WITH_HINTS"] },
    });
    const mediumSolved = await DsaProblem.countDocuments({
      userId,
      difficulty: "MEDIUM",
      status: { $in: ["SOLVED_INDEPENDENTLY", "SOLVED_WITH_HINTS"] },
    });
    const hardSolved = await DsaProblem.countDocuments({
      userId,
      difficulty: "HARD",
      status: { $in: ["SOLVED_INDEPENDENTLY", "SOLVED_WITH_HINTS"] },
    });

    // 3. Revisions Due
    const revisionsDueToday = await Revision.countDocuments({
      userId,
      scheduledDate: { $lte: todayStr },
      status: "PENDING",
    });
    const upcomingRevisions = await Revision.find({
      userId,
      scheduledDate: { $lte: todayStr },
      status: "PENDING",
    })
      .limit(5)
      .lean();

    // 4. Study Hours past 7 days & streak
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
    const recentSessions = await StudySession.find({
      userId,
      date: { $gte: sevenDaysAgo },
    }).lean();

    const totalMinutesWeekly = recentSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const weeklyStudyHours = Math.round((totalMinutesWeekly / 60) * 10) / 10;

    // Calculate daily streak
    const distinctDates = await StudySession.distinct("date", { userId });
    distinctDates.sort().reverse();
    let streak = 0;
    const checkDate = new Date();
    // Check if studied today or yesterday
    const todayInList = distinctDates.includes(todayStr);
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const yesterdayInList = distinctDates.includes(yesterdayStr);

    if (todayInList || yesterdayInList) {
      streak = 1;
      let curr = new Date(todayInList ? todayStr : yesterdayStr);
      while (true) {
        curr.setDate(curr.getDate() - 1);
        const prevStr = curr.toISOString().split("T")[0];
        if (distinctDates.includes(prevStr)) {
          streak++;
        } else {
          break;
        }
      }
    }

    // 5. Monthly Goals
    const now = new Date();
    const activeGoals = await Goal.find({
      userId,
      targetYear: now.getFullYear(),
      targetMonth: now.getMonth() + 1,
      status: "IN_PROGRESS",
    }).lean();

    // 6. Active Job Applications
    const activeApplicationsCount = await JobApplication.countDocuments({
      userId,
      status: { $in: ["APPLIED", "ASSESSMENT", "INTERVIEW_SCHEDULED", "TECHNICAL_ROUND", "HR_ROUND", "OFFER"] },
    });

    // 7. Learning Track Confidence Summary
    const learningTopics = await LearningTopic.find({ userId }).lean();
    const interviewReadyTopics = learningTopics.filter((t) => t.confidence === "INTERVIEW_READY").length;
    const strongTopics = learningTopics.filter((t) => t.confidence === "STRONG").length;

    return NextResponse.json({
      todayTasks,
      completedTasksToday,
      totalTasksToday: todayTasks.length,
      dsa: {
        total: totalDsaProblems,
        solvedIndependently,
        solvedWithHints,
        solutionViewed,
        easySolved,
        mediumSolved,
        hardSolved,
        totalSolved: solvedIndependently + solvedWithHints,
      },
      revisions: {
        dueCount: revisionsDueToday,
        items: upcomingRevisions,
      },
      consistency: {
        weeklyHours: weeklyStudyHours,
        streakDays: Math.max(streak, 1),
      },
      goals: activeGoals,
      activeApplicationsCount,
      learning: {
        totalTopics: learningTopics.length,
        interviewReadyCount: interviewReadyTopics,
        strongCount: strongTopics,
      },
    });
  } catch (error: any) {
    console.error("[Dashboard API Error]", error);
    return NextResponse.json({ error: "Failed to load dashboard metrics" }, { status: 500 });
  }
}

