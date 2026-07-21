import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Users, Award, ShieldCheck, DollarSign, Calendar, MessageSquare } from "lucide-react";
import AdminDashboardCharts from "@/components/AdminDashboardCharts";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  // 1. Fetch KPI counts
  const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
  
  const activeMembers = await prisma.profile.count({
    where: { membershipStatus: "Active", user: { role: "STUDENT" } },
  });

  const trialRequests = await prisma.trialRequest.count({
    where: { status: "Pending" },
  });

  const today = new Date();
  const currentMonthPrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`; // "YYYY-MM"

  const monthlyPayments = await prisma.payment.findMany({
    where: {
      date: { startsWith: currentMonthPrefix },
      status: "Paid",
    },
  });
  const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

  // Average attendance rate calculations
  const attendanceLogs = await prisma.attendance.findMany();
  const totalAttendance = attendanceLogs.length;
  const presentCount = attendanceLogs.filter((log) => log.status === "Present" || log.status === "Late").length;
  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 100;

  // 2. Fetch chart data directly on the server to pass to Client charts
  const allPayments = await prisma.payment.findMany({
    where: { status: "Paid" },
  });
  const studentProfiles = await prisma.profile.findMany({
    where: { user: { role: "STUDENT" } },
    orderBy: { createdAt: "asc" },
  });

  // Last 6 months buckets
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

  // Group student profiles by month
  studentProfiles.forEach((prof) => {
    const createdDate = new Date(prof.createdAt);
    const createdPrefix = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, "0")}`;
    const bucket = last6Months.find((m) => m.prefix === createdPrefix);
    if (bucket) bucket.count += 1;
  });

  let cumulative = 0;
  const studentGrowthData = last6Months.map((m) => {
    cumulative += m.count;
    return { month: m.name.split(" ")[0], students: cumulative };
  });

  // Group payments by month
  const revenueData = last6Months.map((m) => {
    const monthSum = allPayments
      .filter((p) => p.date.startsWith(m.prefix))
      .reduce((sum, p) => sum + p.amount, 0);
    return { month: m.name.split(" ")[0], revenue: monthSum };
  });

  // Group membership distribution counts
  const membershipDistribution = {
    Monthly: 0,
    Quarterly: 0,
    "Semi-Annual": 0,
    Annual: 0,
    Family: 0,
  };
  studentProfiles.forEach((p) => {
    if (p.membershipStatus === "Active") {
      const type = p.membershipType || "Monthly";
      if (membershipDistribution[type as keyof typeof membershipDistribution] !== undefined) {
        membershipDistribution[type as keyof typeof membershipDistribution]++;
      }
    }
  });

  const membershipChartData = Object.keys(membershipDistribution).map((key) => ({
    name: key,
    value: membershipDistribution[key as keyof typeof membershipDistribution],
  }));

  // Group belt distribution
  const beltDistribution: { [key: string]: number } = {};
  studentProfiles.forEach((p) => {
    const belt = p.currentBelt || "White";
    beltDistribution[belt] = (beltDistribution[belt] || 0) + 1;
  });

  const beltChartData = Object.keys(beltDistribution).map((key) => ({
    name: key,
    value: beltDistribution[key],
  }));

  return (
    <div className="space-y-8">
      {/* Admin header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-martial-red uppercase tracking-wider">Super Administrator</span>
          <h1 className="text-2xl font-black text-primary-navy font-display mt-0.5">Management Control Panel</h1>
          <p className="text-xs text-slate-500 font-medium">Real-time metrics, finances, program scheduling, and rank approvals.</p>
        </div>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded">
          🟢 Database online & synced
        </span>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Students</span>
            <p className="text-3xl font-black text-primary-navy font-display">{totalStudents}</p>
            <span className="text-[9px] text-slate-400 block font-medium">Active: {activeMembers}</span>
          </div>
          <div className="bg-slate-100 p-3 rounded-2xl text-primary-navy"><Users className="h-6 w-6" /></div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Monthly Revenue</span>
            <p className="text-3xl font-black text-primary-navy font-display">${monthlyRevenue.toFixed(0)}</p>
            <span className="text-[9px] text-slate-400 block font-medium">July tuition payments</span>
          </div>
          <div className="bg-slate-100 p-3 rounded-2xl text-primary-navy"><DollarSign className="h-6 w-6" /></div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Trial Requests</span>
            <p className="text-3xl font-black text-primary-navy font-display">{trialRequests}</p>
            <span className="text-[9px] text-slate-400 block font-medium">Pending intro calls</span>
          </div>
          <div className="bg-slate-100 p-3 rounded-2xl text-primary-navy"><Calendar className="h-6 w-6" /></div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Attendance Rate</span>
            <p className="text-3xl font-black text-primary-navy font-display">{attendanceRate}%</p>
            <span className="text-[9px] text-slate-400 block font-medium">Average class check-in</span>
          </div>
          <div className="bg-slate-100 p-3 rounded-2xl text-primary-navy"><ShieldCheck className="h-6 w-6" /></div>
        </div>
      </div>

      {/* Recharts Graphical charts panel */}
      <AdminDashboardCharts 
        studentGrowth={studentGrowthData} 
        revenue={revenueData} 
        membership={membershipChartData} 
        belt={beltChartData} 
      />
    </div>
  );
}
