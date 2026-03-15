import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUsers, FaPlay, FaClock, FaChartLine, FaArrowLeft, FaFire } from "react-icons/fa6";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ClipLoader from "react-spinners/ClipLoader";
import API from "../../api/axios.js";

function CourseAnalytics() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!courseId) return;
      try {
        setLoading(true);
        // 🚨 Exactly matching your existing route: analyticsRouter.get("/:courseId")
        const res = await API.get(`/analytics/${courseId}`);
        setAnalytics(res.data.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [courseId]);

  // Helper to format seconds into MM:SS
  const formatTime = (totalSeconds) => {
    if (!totalSeconds) return "00:00";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712]">
      <ClipLoader color="#3B82F6" size={50} />
    </div>
  );

  if (error || !analytics) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#030712] text-white">
      <h2 className="text-2xl font-bold text-slate-400 mb-4">Analytics unavailable</h2>
      <button onClick={() => navigate(-1)} className="text-blue-400 hover:underline">Go Back</button>
    </div>
  );

  // Deconstructing the exact data your backend sends
  const { overview, engagementFunnel } = analytics;

  return (
    <div className="min-h-screen bg-[#030712] text-white p-4 md:p-8 font-inter">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- Header & Navigation --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-[#030712]/90 backdrop-blur-md z-20 py-4 border-b border-white/5">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all group"
            >
              <FaArrowLeft className="text-blue-400 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300">
                Course Intelligence
              </h1>
              <p className="text-slate-500 text-xs md:text-sm font-medium">Deep-dive telemetry and retention metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE SYNCED
          </div>
        </div>

        {/* --- 1. KPI Stats Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<FaUsers />} title="Unique Students" value={overview.uniqueActiveUsers} color="blue" />
          <StatCard icon={<FaPlay />} title="Total Views" value={overview.totalViews} color="purple" />
          <StatCard icon={<FaClock />} title="Total Watch Time" value={`${overview.totalWatchTimeHours} hrs`} color="emerald" />
          <StatCard icon={<FaChartLine />} title="Drop-off Rate" value={overview.dropOffRate} color="red" />
        </div>

        {/* --- 2. Main Analytics Row (The Funnel) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Retention Area Chart */}
          <div className="lg:col-span-2 bg-[#0A0F1C] border border-blue-500/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] pointer-events-none"></div>
            <div className="mb-6 relative z-10">
              <h2 className="text-xl font-bold text-white">Student Retention Funnel</h2>
              <p className="text-sm text-slate-500">View decay across course progression</p>
            </div>
            
            <div className="h-[300px] w-full relative z-10">
              {engagementFunnel?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={engagementFunnel}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="title" hide />
                    <YAxis stroke="#64748B" fontSize={12} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #3B82F6', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                      itemStyle={{ color: '#60A5FA', fontWeight: 'bold' }}
                      labelStyle={{ color: '#94A3B8', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" activeDot={{ r: 6, fill: '#3B82F6', stroke: '#0F172A', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-600 italic">Not enough data to generate funnel</div>
              )}
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="lg:col-span-1 space-y-6 flex flex-col justify-between">
            <div className="bg-gradient-to-br from-[#0F172A] to-[#0A0F1C] border border-blue-500/20 rounded-3xl p-6 shadow-xl flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg"><FaFire className="text-yellow-500 text-xl" /></div>
                <h3 className="text-lg font-bold text-white">Top Performing</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4">Most engaged lecture by view count</p>
              
              <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                <p className="font-bold text-blue-300 truncate">{overview.mostWatchedLecture?.title || "N/A"}</p>
                <div className="flex items-end gap-2 mt-2">
                  <p className="text-3xl font-black text-white">{overview.mostWatchedLecture?.views || 0}</p>
                  <p className="text-sm text-slate-500 mb-1 font-medium">Views</p>
                </div>
              </div>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-2">🚨 System Alert</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your drop-off rate is <span className="text-white font-bold">{overview.dropOffRate}</span>. 
                If this exceeds 40%, consider reviewing the audio quality or pacing of your early lectures to improve student retention.
              </p>
            </div>
          </div>
        </div>

        {/* --- 3. Granular Lecture Breakdown Table --- */}
        <div className="bg-[#0A0F1C] rounded-3xl border border-blue-500/10 shadow-2xl overflow-hidden mt-8">
          <div className="p-6 border-b border-white/5 bg-[#0F172A]/50">
            <h2 className="text-xl font-bold text-white">Granular Lecture Telemetry</h2>
            <p className="text-sm text-slate-500 mt-1">Detailed breakdown of watch time and views per lesson</p>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-[#030712] text-slate-500 border-b border-white/5 tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-bold whitespace-nowrap">Lecture Title</th>
                  <th className="px-6 py-4 font-bold text-center whitespace-nowrap">Total Views</th>
                  <th className="px-6 py-4 font-bold text-center whitespace-nowrap">Total Watch Time</th>
                  <th className="px-6 py-4 font-bold text-right whitespace-nowrap">Avg. View Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {engagementFunnel?.map((lecture, index) => {
                  const avgSeconds = lecture.views > 0 ? Math.round(lecture.watchTimeSeconds / lecture.views) : 0;
                  
                  return (
                    <tr key={lecture.lectureId || index} className="hover:bg-blue-500/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-200">
                        <span className="text-slate-600 mr-3">{index + 1}.</span>
                        {lecture.title}
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-blue-300">
                        {lecture.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center text-slate-400 whitespace-nowrap">
                        {formatTime(lecture.watchTimeSeconds)}
                      </td>
                      <td className="px-6 py-4 text-right text-emerald-400 font-medium whitespace-nowrap">
                        {formatTime(avgSeconds)}
                      </td>
                    </tr>
                  );
                })}
                {(!engagementFunnel || engagementFunnel.length === 0) && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-600 italic">
                      No lecture data tracked yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ icon, title, value, color }) {
  const colors = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    red: "text-red-400 bg-red-500/10 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
  };

  return (
    <div className={`p-6 rounded-3xl border ${colors[color]} backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-white/5`}>
           <div className="text-2xl">{icon}</div>
        </div>
      </div>
      <p className="text-xs font-bold opacity-70 uppercase tracking-widest text-slate-300">{title}</p>
      <p className="text-3xl font-black mt-2 text-white">{value}</p>
    </div>
  );
}

export default CourseAnalytics;