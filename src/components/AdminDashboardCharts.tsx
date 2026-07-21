"use client";

import { useState, useEffect } from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend 
} from "recharts";

interface ChartProps {
  studentGrowth: any[];
  revenue: any[];
  membership: any[];
  belt: any[];
}

export default function AdminDashboardCharts({ studentGrowth, revenue, membership, belt }: ChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-96 flex items-center justify-center text-xs text-slate-400 bg-white border border-slate-100 rounded-3xl">
        Loading analytics charts...
      </div>
    );
  }

  // Predefined chart colors
  const COLORS = ["#0F172A", "#DC2626", "#FBBF24", "#22C55E", "#8B5CF6", "#EC4899", "#3B82F6"];

  return (
    <div className="space-y-8">
      {/* Row 1: Student Growth & Financial Revenue Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Student Growth */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm font-display">Student Growth Trend</h3>
            <p className="text-[10px] text-slate-400">Cumulative student registrations over the last 6 months</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studentGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F172A" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "12px", border: "1px solid #f1f5f9" }} />
                <Area type="monotone" dataKey="students" stroke="#0F172A" strokeWidth={2.5} fillOpacity={1} fill="url(#colorStudents)" name="Total Students" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Revenue */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm font-display">Monthly Revenue Ledger</h3>
            <p className="text-[10px] text-slate-400">Monthly invoice summaries over the last 6 months</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "12px", border: "1px solid #f1f5f9" }} formatter={(val) => [`$${val}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2: Membership distribution & Belt Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Membership distribution */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm font-display">Active Membership Plans</h3>
            <p className="text-[10px] text-slate-400">Distribution of billing contract types</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4">
            {/* Chart */}
            <div className="sm:col-span-7 h-52 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={membership}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {membership.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [val, "Active Students"]} contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="sm:col-span-5 space-y-2 text-xs">
              {membership.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="text-slate-600 font-medium">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Belt distribution */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm font-display">Rank Belt distribution</h3>
            <p className="text-[10px] text-slate-400">Count of active student profiles by current belt rank</p>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={belt} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "12px", border: "1px solid #f1f5f9" }} />
                <Bar dataKey="value" fill="#0f172a" radius={[6, 6, 0, 0]} name="Students">
                  {belt.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.name.toLowerCase().includes("yellow") ? "#fbbf24"
                        : entry.name.toLowerCase().includes("green") ? "#22c55e"
                        : entry.name.toLowerCase().includes("blue") ? "#3b82f6"
                        : entry.name.toLowerCase().includes("purple") ? "#8b5cf6"
                        : entry.name.toLowerCase().includes("brown") ? "#b45309"
                        : entry.name.toLowerCase().includes("red") ? "#dc2626"
                        : entry.name.toLowerCase().includes("black") ? "#020617"
                        : "#94a3b8"
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
