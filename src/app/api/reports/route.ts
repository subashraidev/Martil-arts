import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthStr = String(today.getMonth() + 1).padStart(2, "0");
    const currentMonthPrefix = `${currentYear}-${currentMonthStr}`; // "YYYY-MM"

    // 1. Fetch KPI Metrics
    const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
    
    const activeMembers = await prisma.profile.count({
      where: { membershipStatus: "Active", user: { role: "STUDENT" } },
    });

    const trialRequests = await prisma.trialRequest.count({
      where: { status: "Pending" },
    });

    // Sum of payments this month
    const monthlyPayments = await prisma.payment.findMany({
      where: {
        date: { startsWith: currentMonthPrefix },
        status: "Paid",
      },
    });
    const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

    // Sum of all payments (total revenue)
    const allPayments = await prisma.payment.findMany({
      where: { status: "Paid" },
    });
    const totalRevenue = allPayments.reduce((sum, p) => sum + p.amount, 0);

    // 2. Fetch all student profiles for growth & membership distribution analysis
    const studentProfiles = await prisma.profile.findMany({
      where: { user: { role: "STUDENT" } },
      orderBy: { createdAt: "asc" },
    });

    // 3. Process Student Growth chart data (last 6 months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const last6Months: { name: string; prefix: string; count: number }[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const mPrefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      last6Months.push({
        name: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
        prefix: mPrefix,
        count: 0,
      });
    }

    studentProfiles.forEach((prof) => {
      const createdDate = new Date(prof.createdAt);
      const createdPrefix = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, "0")}`;
      
      const bucket = last6Months.find((m) => m.prefix === createdPrefix);
      if (bucket) {
        bucket.count += 1;
      }
    });

    // Make it cumulative growth
    let cumulative = 0;
    const studentGrowthChart = last6Months.map((m) => {
      cumulative += m.count;
      return {
        month: m.name,
        students: cumulative,
      };
    });

    // 4. Process Revenue chart data (last 6 months)
    const revenueChart = last6Months.map((m) => {
      const monthSum = allPayments
        .filter((p) => p.date.startsWith(m.prefix))
        .reduce((sum, p) => sum + p.amount, 0);
      return {
        month: m.name,
        revenue: monthSum,
      };
    });

    // 5. Process Membership distribution
    const membershipTypeCounts: { [key: string]: number } = {
      Monthly: 0,
      Quarterly: 0,
      "Semi-Annual": 0,
      Annual: 0,
      Family: 0,
    };

    studentProfiles.forEach((p) => {
      if (p.membershipStatus === "Active") {
        const type = p.membershipType || "Monthly";
        if (membershipTypeCounts[type] !== undefined) {
          membershipTypeCounts[type]++;
        } else {
          membershipTypeCounts[type] = 1;
        }
      }
    });

    const membershipChart = Object.keys(membershipTypeCounts).map((key) => ({
      name: key,
      value: membershipTypeCounts[key],
    }));

    // 6. Process Attendance rates
    const attendanceLogs = await prisma.attendance.findMany();
    const totalAttendanceCount = attendanceLogs.length;
    const presentCount = attendanceLogs.filter((log) => log.status === "Present").length;
    const lateCount = attendanceLogs.filter((log) => log.status === "Late").length;
    const absentCount = attendanceLogs.filter((log) => log.status === "Absent").length;

    const attendanceRate = totalAttendanceCount > 0 
      ? Math.round(((presentCount + lateCount) / totalAttendanceCount) * 100) 
      : 100;

    const attendanceChart = [
      { name: "Present", value: presentCount },
      { name: "Late", value: lateCount },
      { name: "Absent", value: absentCount },
    ];

    // 7. Process Belt Promotion distributions
    const beltPromotions = await prisma.beltProgress.findMany({
      where: { status: "Completed", promotedAt: { not: null } },
      orderBy: { promotedAt: "asc" },
    });

    const beltDistribution: { [key: string]: number } = {};
    studentProfiles.forEach((p) => {
      const belt = p.currentBelt || "White";
      beltDistribution[belt] = (beltDistribution[belt] || 0) + 1;
    });

    const beltChart = Object.keys(beltDistribution).map((key) => ({
      name: key,
      value: beltDistribution[key],
    }));

    return NextResponse.json({
      metrics: {
        totalStudents,
        activeMembers,
        monthlyRevenue,
        totalRevenue,
        trialRequests,
        attendanceRate,
      },
      charts: {
        studentGrowth: studentGrowthChart,
        revenue: revenueChart,
        membership: membershipChart,
        attendance: attendanceChart,
        beltDistribution: beltChart,
      },
    });
  } catch (error) {
    console.error("Fetch reports error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
