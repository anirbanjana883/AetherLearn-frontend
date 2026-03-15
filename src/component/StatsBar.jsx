import React from 'react';
import { FaBook, FaTasks, FaFire } from 'react-icons/fa';

// 🚨 Accept 'stats' as a prop from StudentDashboard
function StatsBar({ stats }) {
  
  // Safely map the props to your UI
  const statItems = [
    { icon: <FaBook />, value: stats?.enrolledCount || 0, label: "Courses Enrolled" },
    { icon: <FaTasks />, value: stats?.lecturesCompleted || 0, label: "Lectures Completed" },
    { icon: <FaFire />, value: `${stats?.currentStreak || 0} Days`, label: "Current Streak" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {statItems.map((item, index) => (
        <div 
          key={index} 
          className="bg-slate-900/40 backdrop-blur-md border border-blue-500/40 shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all duration-500 hover:shadow-[0_0_45px_rgba(37,99,235,0.6)] rounded-2xl p-6 flex items-center gap-6"
        >
          <div className="p-4 bg-slate-800/80 rounded-full border border-slate-700">
            {React.cloneElement(item.icon, { className: "text-3xl text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" })}
          </div>
          <div>
            <p className="text-3xl font-black text-white">{item.value}</p>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;