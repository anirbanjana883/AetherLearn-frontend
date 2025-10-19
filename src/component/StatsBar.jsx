import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { FaBook, FaTasks, FaFire } from 'react-icons/fa'; // Icons for stats

function StatsBar() {
  const [stats, setStats] = useState({
    enrolledCount: 0,
    lecturesCompleted: 0,
    currentStreak: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/stats/student`, { withCredentials: true });
        setStats(result.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  const statItems = [
    { icon: <FaBook />, value: stats.enrolledCount, label: "Courses Enrolled" },
    { icon: <FaTasks />, value: stats.lecturesCompleted, label: "Activities Logged" },
    { icon: <FaFire />, value: `${stats.currentStreak} Days`, label: "Current Streak" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {statItems.map((item, index) => (
        <div key={index} className="bg-slate-900/40 backdrop-blur-md border  border-blue-500/40 shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all duration-500 hover:shadow-[0_0_45px_rgba(37,99,235,0.6)] rounded-xl p-6 flex items-center gap-6">
          <div className="p-4 bg-slate-800 rounded-full">
            {React.cloneElement(item.icon, { className: "text-3xl text-cyan-400" })}
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{item.value}</p>
            <p className="text-sm text-slate-400">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;